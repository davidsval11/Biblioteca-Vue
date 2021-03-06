<template>
  <div class="row">
    <div class="col-md-12">
      <CCard>
        <CCardHeader>
          <CIcon name="cil-bank" />Loans
          <CButton
            size="md"
            color="info"
            class="offset-10"
            @click="modalNewLoan = true; actionLoan = 1;"
          >
            <CIcon name="cil-plus" />New
          </CButton>
        </CCardHeader>
      </CCard>
    </div>

    <div class="col-md-12">
      <CCardBody>
        <CDataTable
          :items="loans"
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
                <h4>{{item.title_book}}</h4>
                <p class="text-white m-0">ISBN: {{item.isbn_book}}</p>
                <p class="text-white m-0">ID Reader: {{item.id_reader}}</p>
                <p class="text-white m-0">Name Reader: {{item.name_reader}}</p>
                <p class="text-white m-0">Loan Date: {{item.date_loan}}</p>
                <p class="text-white m-0">Loan Return: {{item.date_return}}</p>
                <CButton size="sm" color="info" class="ml-2" @click="editLoan(item)">Edit</CButton>
                <CButton
                  size="sm"
                  color="success"
                  class="ml-2"
                  @click="retornBook(item)"
                >Return Book</CButton>
                <CButton size="sm" color="danger" class="ml-2" @click="destroyLoan(item)">Delete</CButton>
              </CCardBody>
            </CCollapse>
          </template>
        </CDataTable>
      </CCardBody>
    </div>

    <CModal title="Add Loan" color="info" :show.sync="modalNewLoan" size="lg">
      <CRow>
        <CCol :col="4">
          <label>Reader</label>
          <v-select label="name_reader" class="mb-2" :options="readers" v-model="selectReader" />
        </CCol>
        <CCol :col="8">
          <label>Book</label>
          <v-select label="title" class="mb-2" :options="books" v-model="selectBook" />
        </CCol>
      </CRow>
      <CRow>
        <CCol :col="3">
          <CInput type="date" label="Date Loan" v-model="loan.date_loan" required was-validated></CInput>
        </CCol>
        <CCol :col="3">
          <CInput type="date" label="Date Return" v-model="loan.date_return" required was-validated></CInput>
        </CCol>
        <CCol :col="1">
          <CBadge :color="getBadge(loan.status)">{{loan.status}}</CBadge>
        </CCol>
      </CRow>

      <div slot="footer">
        <CButton type="submit" color="info" @click="addLoan()">
          <CIcon name="cil-check-circle" />Submit
        </CButton>
      </div>
    </CModal>
  </div>
</template>
<script>
import axios from "axios";

export default {
  name: "loans",
  data() {
    return {
      actionLoan: 0,
      loan: {},
      selectBook: {},
      selectReader: {},
      details: [],
      collapseDuration: 0,
      loans: [],
      readers: [],
      books: [],
      ipback: "http://25.19.174.176:88/",
      fields: [
        { key: "id", label: "Id" },
        { key: "title_book" },
        { key: "name_reader" },
        { key: "date_loan" },
        { key: "status" },
        {
          key: "show_details",
          label: "",
          _style: "width:1%",
          sorter: false,
          filter: false
        }
      ],
      modalNewLoan: false
    };
  },
  methods: {
    toggleDetails(item) {
      this.$set(this.loans[item.id], "_toggled", !item._toggled);
      this.collapseDuration = 300;
      this.$nextTick(() => {
        this.collapseDuration = 0;
      });
    },
    getBadge(status) {
      switch (status) {
        case "Active":
          return "success";
        case "Return":
          return "secondary";
        default:
          "primary";
      }
    },
    addLoan() {
      this.loan.isbn_book = this.selectBook.isbn;
      this.loan.title_book = this.selectBook.title;
      this.loan._id_book = this.selectBook._id_book;

      this.loan.id_reader = this.selectReader.id;
      this.loan.name_reader = this.selectReader.name_reader;
      this.loan._id_reader = this.selectReader._id_reader;
      if (this.actionLoan == 1) {
        this.loan.status = "Active";

        axios
          .get(this.ipback + "loans/store", {
            params: this.loan
          })
          .then(response => {
            this.modalNewLoan = false;
            this.getLoans();
          });
      } else {
        this.updateLoan();
      }
    },

    editLoan(loan) {
      this.actionLoan = 2;
      this.modalNewLoan = true;
      this.loan = loan;
      this.selectReader = {
        id_reader: loan.id_reader,
        _id_reader: loan._id_reader,
        name_reader: loan.name_reader
      };
      this.selectBook = {
        _id_book: loan._id_book,
        title: loan.title_book,
        isbn: loan.isbn_book
      };
    },

    updateLoan() {
      axios
        .get(this.ipback + "loans/update", {
          params: this.loan
        })
        .then(response => {
          this.$swal({
            position: "top-end",
            icon: "success",
            title: response.data.message,
            showConfirmButton: false,
            timer: 1500
          });

          this.modalNewLoan = false;
          this.getLoans();
        });
    },

    retornBook(loan) {
      this.loan._id = loan._id;
      this.loan._id_book = loan._id_book;
      
      this.loan.status = "Return";
      this.$swal({
        title: "Esta seguro de retornar el libro?",
        text: "Esta accion no se puede revertir!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        confirmButtonText: "Si, Retornar!",
        closeOnConfirm: true
      }).then(result => {
        if (result.value) {
          axios
            .get(this.ipback + "loans/returnBook", {
              params: this.loan
            })
            .then(response => {
              this.$swal({
                position: "top-end",
                icon: "success",
                title: response.data.message,
                showConfirmButton: false,
                timer: 1500
              });

              this.modalNewLoan = false;
              this.getLoans();
            });
        }
      });
    },

    getLoans() {
      axios.get(this.ipback + "loans").then(response => {
        this.loans = response.data.loans.map((item, id) => {
          return { ...item, id };
        });
      });
    },

    getReaders() {
      axios.get(this.ipback + "readers").then(response => {
        for (let i = 0; i < response.data.readers.length; i++) {
          let element = response.data.readers[i];
          let reader = {
            id_reader: element.id,
            _id_reader: element._id,
            name_reader: element.name + " " + element.last_name
          };
          this.readers.push(reader);
        }
      });
    },
    getBooks() {
      axios.get(this.ipback + "books").then(response => {
        for (let i = 0; i < response.data.books.length; i++) {
          let element = response.data.books[i];
          let book = {
            _id_book: element._id,
            title: element.title,
            isbn: element.isbn
          };
          this.books.push(book);
        }
      });
    },

    destroyLoan(loan) {
      this.loan = loan;
      this.$swal({
        title: "Esta seguro de eliminar el Prestamo?",
        text: "Esta accion no se puede revertir!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        confirmButtonText: "Si, Eliminar!",
        closeOnConfirm: true
      }).then(result => {
        if (result.value) {
          axios
            .get(this.ipback + "loans/destroy", {
              params: this.loan
            })
            .then(response => {
              this.$swal({
                position: "top-end",
                icon: "success",
                title: response.data.message,
                showConfirmButton: false,
                timer: 1500
              });

              this.modalNewLoan = false;
              this.getLoans();
            });
        }
      });
    }
  },

  mounted() {
    this.getLoans();
    this.getReaders();
    this.getBooks();
  }
};
</script>
