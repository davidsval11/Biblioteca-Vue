<template>
  <div class="row">
    <div class="col-md-12">
      <CCard>
        <CCardHeader>
          <CIcon name="cil-people" />Readers
          <CButton size="md" color="info" class="offset-10" @click="modalNewReader = true; actionReader = 1;">
            <CIcon name="cil-library-add" />New
          </CButton>
        </CCardHeader>
      </CCard>
    </div>

    <div class="col-md-12">
      <CCardBody>
        <CDataTable
          :items="readers"
          :fields="fields"
          table-filter
          items-per-page-select
          :items-per-page="5"
          hover
          dark
          striped
          outlined
          fixed
          border
          sorter
          pagination
        >
          <template #status="{item}">
            <td>
              <CBadge :color="getBadge(item.status)">{{item.status}}</CBadge>
            </td>
          </template>
          <template #show_details="{item, index}">
            <td class="py-2">
              <CButton
                color="light"
                square
                size="sm"
                @click="toggleDetails(item, index)"
              >{{Boolean(item._toggled) ? 'Less' : 'More'}}</CButton>
            </td>
          </template>
          <template #details="{item}">
            <CCollapse :show="Boolean(item._toggled)" :duration="collapseDuration">
              <CCardBody>
                <CMedia :aside-image-props="{ height: 102 }">
                  <h4>{{item.title}}</h4>
                  <p class="text-white m-0">Age: {{item.age}}</p>
                  <p class="text-white m-0">Email: {{item.email}}</p>
                  <p class="text-white m-0">Phone: {{item.phone}}</p>
                  <p class="text-white m-0">Mobile: {{item.cell}}</p>
                  <CButton size="sm" color="info" class @click="editReader(item)">Edit</CButton>
                  <CButton size="sm" color="danger" class="ml-1" @click="destroyReader(item)">Delete</CButton>
                </CMedia>
              </CCardBody>
            </CCollapse>
          </template>
        </CDataTable>
      </CCardBody>
    </div>
    <CModal title="Add Reader" color="info" :show.sync="modalNewReader" size="lg" @ok="reader.id = 1000">
      <CRow>
        <CCol :col="4">
          <CInput
            type="number"
            placeholder="Identificación"
            label="Identificación"
            v-model="reader.id"
            required
            was-validated
          >
            <template #prepend-content>
              <CIcon name="cil-user" />
            </template>
          </CInput>
        </CCol>
        <CCol :col="4">
          <CInput placeholder="Name" label="Name" v-model="reader.name" required was-validated>
            <template #prepend-content>
              <CIcon name="cil-user" />
            </template>
          </CInput>
        </CCol>
        <CCol :col="4">
          <CInput placeholder="LastName" label="LastName" v-model="reader.last_name" required was-validated>
            <template #prepend-content>
              <CIcon name="cil-user" />
            </template>
          </CInput>
        </CCol>

        <CCol :col="3">
          <CInput placeholder="Age" label="Age" v-model="reader.age" required was-validated>
            <template #prepend-content>
              <CIcon name="cil-user" />
            </template>
          </CInput>
        </CCol>

        <CCol :col="5">
          <CInput
            type= "text"
            placeholder="Address"
            label="Address"
            v-model="reader.address"
            required
            was-validated
          >
            <template #prepend-content>
              <CIcon name="cil-contact" />
            </template>
          </CInput>
        </CCol>

        <CCol :col="4">
          <CInput type="email" placeholder="Email" label="Email" v-model="reader.email" was-validated required>
            <template #prepend-content>
              <CIcon name="cil-contact" />
            </template>
          </CInput>
        </CCol>
        <CCol :col="4">
          <CInput
            type="number"
            placeholder="Phone"
            label="Phone"
            required
            v-model="reader.phone"
            was-validated
          >
            <template #prepend-content>
              <CIcon name="cil-mobile" />
            </template>
          </CInput>
        </CCol>
        <CCol :col="4">
          <CInput
            type="number"
            placeholder="Mobile"
            label="Mobile"
            v-model="reader.cell"
            was-validated
            required
          >
          <template #prepend-content>
            <CIcon name="cil-mobile" />
          </template>
          </CInput>
        </CCol>
        <CCol :col="1">
          <CBadge :color="getBadge(reader.status)">{{reader.status}}</CBadge>
        </CCol>
      </CRow>
      <div slot="footer">
        <CButton type="submit" color="info" @click="addReader()">
          <CIcon name="cil-check-circle" />Submit
        </CButton>
      </div>
    </CModal>
  </div>
</template>
<script>
import axios from "axios";

export default {
  name: "readers",
  data() {
    return {
      actionReader: 0,
      reader: {},
      details: [],
      collapseDuration: 0,
      readers: [],
      ipback: "http://25.19.174.176:88/",
      fields: [
        { key: "id", label: "Identificación" },
        { key: "name", label: "Name" },
        { key: "last_name", label: "Last Name" },
        { key: "address", label: "Address" },
        { key: "status" },
        {
          key: "show_details",
          label: "",
          _style: "width:1%",
          sorter: false,
          filter: false
        }
      ],
      modalNewReader: false
    };
  },
  methods: {
    toggleDetails(item) {
      this.$set(this.readers[item.i], "_toggled", !item._toggled);
      this.collapseDuration = 300;
      this.$nextTick(() => {
        this.collapseDuration = 0;
      });
    },

    getBadge (status) {
      switch (status) {
        case 'Active': return 'success'
        case 'Inactive': return 'secondary'
        case 'Lending': return 'warning'
        case 'Undelivered': return 'danger'
        default: 'primary'
      }
    },

    addReader() {
      if (this.actionReader == 1) {
        this.reader.status = "Active";
        axios
          .get(this.ipback + "readers/store", {
            params: this.reader
          })
          .then(response => {
            this.modalNewReader = false;
            this.getReaders();
          });
      } else {
        this.updateReader();
      }
    },

    editReader(reader) {
      this.actionReader = 2;
      this.modalNewReader = true;
      this.reader = reader;
    },

    updateReader() {
      axios
        .get(this.ipback + "readers/update", {
          params: this.reader
        })
        .then(response => {
          this.$swal({
            position: "top-end",
            icon: "success",
            title: response.data.message,
            showConfirmButton: false,
            timer: 1500
          });

          this.modalNewReader = false;
          this.getReaders();
        });
    },

    getReaders() {
      axios.get(this.ipback + "readers").then(response => {
      this.readers = response.data.readers.map((item, i) => {
        return { ...item, i };
      });
    });
    },

    destroyReader(reader) {
      this.reader = reader;
      this.$swal({
        title: "Esta seguro de eliminar el libro?",
        text: "Esta accion no se puede revertir!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        confirmButtonText: "Si, Eliminar!",
        closeOnConfirm: true
      }).then(result => {
        if (result.value) {
          axios
            .get(this.ipback + "readers/destroy", {
              params: this.reader
            })
            .then(response => {
              this.$swal({
                position: "top-end",
                icon: "success",
                title: response.data.message,
                showConfirmButton: false,
                timer: 1500
              });

              this.modalNewReader = false;
              this.getReaders();
            });
        }
      });
    }
  },

  mounted() {
    this.getReaders();
  }
};
</script>
