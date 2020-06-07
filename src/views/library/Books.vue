<template>
  <div class="row">
    <div class="col-md-12">
      <CCard>
        <CCardHeader>
          <CIcon name="cil-bank" />Books
          <CButton
            size="md"
            color="info"
            class="offset-10"
            @click="modalNewBook = true; actionBook = 1;"
          >
            <CIcon name="cil-library-add" />New
          </CButton>
        </CCardHeader>
      </CCard>
    </div>

    <div class="col-md-12">
      <CCardBody>
        <CDataTable
          :items="books"
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
                <h4>{{item.title}}</h4>
                <p class="text-white m-0">Observations: {{item.obs}}</p>
                <p class="text-white m-0">Year: {{item.year}}</p>
                <p class="text-white m-0">pages: {{item.pages}}</p>
                <CButton size="sm" color="info" class @click="editBook(item)">Edit</CButton>
                <CButton size="sm" color="danger" class="ml-2" @click="destroyBook(item)">Delete</CButton>
              </CCardBody>
            </CCollapse>
          </template>
        </CDataTable>
      </CCardBody>
    </div>

    <CModal title="Add Book" color="info" :show.sync="modalNewBook" size="lg">
      <CRow>
        <CCol :col="4">
          <CInput
            type="number"
            placeholder="ISBN"
            label="ISBN"
            v-model="book.isbn"
            required
            was-validated
          >
            <template #prepend-content>
              <CIcon name="cil-user" />
            </template>
          </CInput>
        </CCol>
        <CCol :col="8">
          <CInput placeholder="Title" label="Title" v-model="book.title" required was-validated>
            <template #prepend-content>
              <CIcon name="cil-user" />
            </template>
          </CInput>
        </CCol>
        <CCol :col="4">
          <CInput placeholder="Genre" label="Genre" v-model="book.genre" required was-validated>
            <template #prepend-content>
              <CIcon name="cil-user" />
            </template>
          </CInput>
        </CCol>

        <CCol :col="8">
          <CInput placeholder="Author" label="Author" v-model="book.author" required was-validated>
            <template #prepend-content>
              <CIcon name="cil-user" />
            </template>
          </CInput>
        </CCol>

        <CCol :col="5">
          <CInput
            placeholder="Editorial"
            label="Editorial"
            v-model="book.editorial"
            required
            was-validated
          >
            <template #prepend-content>
              <CIcon name="cil-user" />
            </template>
          </CInput>
        </CCol>

        <CCol :col="3">
          <CInput type="number" placeholder="Year" label="Year" v-model="book.year" was-validated>
            <template #prepend-content>
              <CIcon name="cil-user" />
            </template>
          </CInput>
        </CCol>
        <CCol :col="3">
          <CInput
            type="number"
            placeholder="Pages"
            label="Pages"
            v-model="book.pages"
            was-validated
          >
            <template #prepend-content>
              <CIcon name="cil-user" />
            </template>
          </CInput>
        </CCol>
        <CCol :col="1">
          <CBadge :color="getBadge(book.status)">{{book.status}}</CBadge>
        </CCol>
        
      </CRow>
      <CRow>
        <CCol :col="12">
          <CTextarea
            label="Observations"
            placeholder="observations..."
            rows="3"
            v-model="book.obs"
          />
        </CCol>
      </CRow>
      <div slot="footer">
        <CButton type="submit" color="info" @click="addBook()">
          <CIcon name="cil-check-circle" />Submit
        </CButton>
      </div>
    </CModal>
  </div>
</template>
<script>
import axios from "axios";

export default {
  name: "books",
  data() {
    return {
      actionBook: 0,
      book: {},
      details: [],
      collapseDuration: 0,
      books: [],
      ipback: "http://25.19.174.176:88/",
      fields: [
        { key: "isbn", label: "ISBN" },
        { key: "title", label: "Title" },
        { key: "genre" },
        { key: "author" },
        { key: "editorial" },
        { key: "status" },
        {
          key: "show_details",
          label: "",
          _style: "width:1%",
          sorter: false,
          filter: false
        }
      ],
      modalNewBook: false
    };
  },
  methods: {
    toggleDetails(item) {
      this.$set(this.books[item.id], "_toggled", !item._toggled);
      this.collapseDuration = 300;
      this.$nextTick(() => {
        this.collapseDuration = 0;
      });
    },
     getBadge (status) {
      switch (status) {
        case 'Active': return 'success'
        case 'Inactive': return 'secondary'
        case 'Loan': return 'warning'
        case 'Undelivered': return 'danger'
        default: 'primary'
      }
    },
    addBook() {
      if (this.actionBook == 1) {
        this.book.status = "Active";
        axios
          .get(this.ipback + "books/store", {
            params: this.book
          })
          .then(response => {
            this.modalNewBook = false;
            this.getBooks();
          });
      } else {
        this.updateBook();
      }
    },

    editBook(book) {
      this.actionBook = 2;
      this.modalNewBook = true;
      this.book = book;
    },

    updateBook() {
      axios
        .get(this.ipback + "books/update", {
          params: this.book
        })
        .then(response => {
          this.$swal({
            position: "top-end",
            icon: "success",
            title: response.data.message,
            showConfirmButton: false,
            timer: 1500
          });

          this.modalNewBook = false;
          this.getBooks();
        });
    },

    getBooks() {
      axios.get(this.ipback + "books").then(response => {
        this.books = response.data.books.map((item, id) => {
          return { ...item, id };
        });
      });
    },

    destroyBook(book) {
      this.book = book;
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
            .get(this.ipback + "books/destroy", {
              params: this.book
            })
            .then(response => {
              this.$swal({
                position: "top-end",
                icon: "success",
                title: response.data.message,
                showConfirmButton: false,
                timer: 1500
              });

              this.modalNewBook = false;
              this.getBooks();
            });
        }
      });
    }
  },

  mounted() {
    this.getBooks();
  }
};
</script>
