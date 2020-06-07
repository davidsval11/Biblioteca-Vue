<template>
  <div class="row">
    <div class="col-md-12">
      <CCard>
        <CCardHeader>
          <CIcon name="cil-bank" />Books
          <CButton size="md" color="info" class="offset-10" @click="modalNewBook = true">
            <CIcon name="cil-plus" />New
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
                  <p class="text-white m-0">Observations: {{item.obs}}</p>
                  <p class="text-white m-0">Year: {{item.year}}</p>
                  <p class="text-white m-0">pages: {{item.pages}}</p>
                  <CButton size="sm" color="info" class>Edit</CButton>
                  <CButton size="sm" color="danger" class="ml-1">Delete</CButton>
                </CMedia>
              </CCardBody>
            </CCollapse>
          </template>
        </CDataTable>
      </CCardBody>
    </div>

    <CModal title="Add Book" color="info" :show.sync="modalNewBook" size="lg" @ok="book.id = 1000">
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
      </CRow>
      <CRow>
        <CCol :col="12">
          <CTextarea label="Observations" placeholder="observations..." rows="3" />
        </CCol>
      </CRow>
      <div slot="footer">
        <CButton type="reset" color="danger" @click="book = {}">
          <CIcon name="cil-ban" />Reset
        </CButton>
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
      book: {},
      details: [],
      collapseDuration: 0,
      books: [],
      ipback: "http://25.19.174.176:88/",
      fields: [
        { key: "id", label: "ISBN" },
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

    addBook() {
      axios.post(
        this.ipback + "books",
        this.book
      ).then(response => {
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
    }
  },

  mounted() {
    this.getBooks();
  }
};
</script>
