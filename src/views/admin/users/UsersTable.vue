<template>
  <v-card>
    <v-card-text>
      <v-text-field
        v-model.trim.lazy="search"
        append-icon="mdi-magnify"
        label="Search by Name or Email"
        single-line
        hide-details
        clearable
      ></v-text-field>
    </v-card-text>
    <v-data-table
      :headers="headers"
      :items="users"
      :options.sync="options"
      :server-items-length="totalUsers"
      :loading="loading"
      mobile-breakpoint="0">
      <template v-slot:item.name="{ item }">
        <user-name :user="item"/>
      </template>
      <template v-slot:item.role="{ item }">
        <v-tooltip top>
          <template #activator="{on, attrs}">
            <v-chip color="primary" v-on="on" v-bind="attrs" small dark>
              {{ item.role.title }}
            </v-chip>
          </template>
          {{item.role.description}}
        </v-tooltip>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-icon
          @click="onEdit(item)"
          small>
          mdi-pencil
        </v-icon>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
  import UserName from '../../../components/UserName'
  import _ from 'lodash'
  import { API_USERS } from '../../../constants/paths'

  export default {
    name: 'UsersTable',
    props: {
      onEdit: {
        type: Function,
        required: true
      }
    },
    data: function () {
      return {
        search: '',
        loading: true,
        totalUsers: 0,
        users: [],
        options: {},
        headers: [
          {
            text: 'Name',
            value: 'name'
          },
          {
            text: 'Email',
            value: 'email'
          },
          {
            text: 'Role',
            value: 'role'
          },
          {
            text: 'Actions',
            value: 'actions',
            sortable: false
          }
        ]
      }
    },
    watch: {
      options: {
        handler () {
          this.getDataFromApi()
        },
        deep: true
      },
      search: _.debounce(function () {
        this.getDataFromApi()
      }, 1000)
    },
    methods: {
      getDataFromApi () {
        this.loading = true
        const { sortBy, sortDesc, page, itemsPerPage } = this.options
        const direction = sortDesc[0] ? 'desc' : 'asc'
        const sort = sortBy[0] || ''

        return this.$http({
          url: API_USERS,
          method: 'GET',
          params: {
            page: page - 1,
            size: itemsPerPage,
            filter: this.search,
            sort: sort,
            direction: direction
          }
        }).then(data => {
          this.loading = false
          this.users = data.items
          this.totalUsers = data.totalItems
        }).catch(response => {
          this.loading = false
          this.users = []
        })
      }
    },
    components: {
      UserName
    }
  }
</script>

<style scoped>

</style>