<template>
  <div>
    <CCard>
      <CCardHeader>
        <CIcon name="cil-bank"/> Books
        <CButton size="md" color="default" class="offset-10">
          <CIcon name="cil-plus"/> New
        </CButton>
      </CCardHeader>
    </CCard>  
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
            color="primary"
            variant="outline"
            square
            size="sm"
            @click="toggleDetails(item, index)"
          >
            {{Boolean(item._toggled) ? 'Hide' : 'Show'}}
          </CButton>
        </td>
      </template>
      <template #details="{item}">
        <CCollapse :show="Boolean(item._toggled)" :duration="collapseDuration">
          <CCardBody>
            <CMedia :aside-image-props="{ height: 102 }">
              <h4>
                {{item.title}}
              </h4>
              <p class="text-white m-0">Observations: {{item.obs}}</p>
              <p class="text-white m-0">Year: {{item.year}}</p>
              <p class="text-white m-0">pages: {{item.pages}}</p>
              <CButton size="sm" color="info" class="">
                Edit
              </CButton>
              <CButton size="sm" color="danger" class="ml-1">
                Delete
              </CButton>
            </CMedia>
          </CCardBody>
        </CCollapse>
      </template>
    </CDataTable>
  </CCardBody>
  </div>
</template>
<script>
import axios from 'axios'

export default {
  name: 'app',
  data () {
    return {
      details: [],
      collapseDuration: 0,
      books: [],
      ipback: 'http://25.19.174.176:88/',
      fields: [
      { key: 'id', label: 'ISBN'},
      { key: 'title', label: 'Title'},  
      { key: 'genre'},
      { key: 'author' },
      { key: 'editorial' },
      { key: 'status' },
      { 
        key: 'show_details', 
        label: '', 
        _style: 'width:1%', 
        sorter: false, 
        filter: false
      }
    ]
    }
  },
  methods:{
    toggleDetails (item) {
      this.$set(this.books[item.id], '_toggled', !item._toggled)
      this.collapseDuration = 300
      this.$nextTick(() => { this.collapseDuration = 0})
    }
  },

  mounted() {
    axios
      .get(this.ipback+'books') 
      .then(response => {
        this.books = response.data.books.map((item, id) => { return {...item, id}})
      })
  },
}
</script>
