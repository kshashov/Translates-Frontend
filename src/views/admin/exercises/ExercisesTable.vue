<template>
  <v-card>
    <v-card-title>
      <v-spacer></v-spacer>
      <v-btn
        @click="onCreate"
        color="success"
        outlined
        small
      >
        <v-icon left>mdi-plus-circle</v-icon>
        Create
      </v-btn>
    </v-card-title>
    <v-card-text>
      <v-row>
        <v-col cols="12" lg="6">
          <v-text-field
            v-model.trim="search"
            append-icon="mdi-magnify"
            label="Search by Title or Creator"
            single-line
            hide-details
            clearable
          ></v-text-field>
        </v-col>
        <v-col cols="4" lg="2">
          <v-combobox
            v-model="filter.tag"
            :items="tags"
            label="Category"
            :loading="!tags"
            item-text="title"
            hide-details
            return-object
            clearable
          ></v-combobox>
        </v-col>
        <v-col cols="4" lg="2">
          <v-combobox
            v-model="filter.from"
            :items="langs"
            label="From"
            :loading="!langs"
            item-text="title"
            hide-details
            return-object
            clearable
          ></v-combobox>
        </v-col>
        <v-col cols="4" lg="2">
          <v-combobox
            v-model="filter.to"
            :items="langs"
            label="To"
            :loading="!langs"
            item-text="title"
            hide-details
            return-object
            clearable
          ></v-combobox>
        </v-col>
      </v-row>
    </v-card-text>
    <v-data-table
      :headers="headers"
      :items="exercises"
      :options.sync="options"
      :server-items-length="totalExercises"
      :loading="loading"
      mobile-breakpoint="0"
    >
      <template v-slot:item.title="{ item }">
        <a>
          <router-link
            :to="{name: 'Exercise', params: { id: item.id }}"
            target="_blank">
            {{item.title}}
          </router-link>
        </a>
      </template>
      <template v-slot:item.langs="{ item }">
        {{item.from.code}} — {{item.to.code}}
      </template>
      <template v-slot:item.creator.name="{ item }">
        <user-name :user="item.creator"/>
      </template>
      <template v-slot:item.tags="{ item }">
        <v-tooltip :key="tag.id" v-for="tag in item.tags" top>
          <template #activator="{on}">
            <v-chip color="primary" v-on="on" class="ma-1" small dark>
              {{ tag.title }}
            </v-chip>
          </template>
          {{ tag.title }}
        </v-tooltip>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-tooltip top>
          <template #activator="{on}">
            <v-icon
              @click="onEdit(item)"
              v-on="on"
              small
              left
            > mdi-pencil
            </v-icon>
          </template>
          Update info
        </v-tooltip>

        <v-tooltip top>
          <template #activator="{on}">
            <v-icon
              @click="onEditSteps(item)"
              v-on="on"
              small
              left
            > mdi-pencil-outline
            </v-icon>
          </template>
          Update steps
        </v-tooltip>

        <v-tooltip top>
          <template #activator="{on}">
            <v-icon
              @click="onDelete(item)"
              v-on="on"
              small
            > mdi-delete
            </v-icon>
          </template>
          Delete
        </v-tooltip>

      </template>
    </v-data-table>
  </v-card>
</template>

<script>
  import UserName from '../../../components/UserName'
  import lodash from 'lodash'
  import LangsMixin from '../../../mixins/LangsMixin'
  import TagsMixin from '../../../mixins/TagsMixin'
  import { API_EXERCISES } from '../../../constants/paths'

  export default {
    name: 'ExercisesTable',
    mixins: [
      LangsMixin, TagsMixin
    ],
    props: {
      onCreate: {
        type: Function,
        required: true
      },
      onEdit: {
        type: Function,
        required: true
      },
      onEditSteps: {
        type: Function,
        required: true
      },
      onDelete: {
        type: Function,
        required: true
      }
    },
    data: function () {
      return {
        search: '',
        filter: {
          from: undefined,
          to: undefined,
          tag: undefined
        },
        totalExercises: 0,
        exercises: [],
        loading: true,
        options: {},
        headers: [
          {
            text: 'Title',
            value: 'title'
          },
          {
            text: 'Creator',
            value: 'creator.name'
          },
          {
            text: 'Langs',
            value: 'langs',
            sortable: false
          },
          {
            text: 'Tags',
            value: 'tags',
            sortable: false
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
      search: lodash.debounce(function () {
        this.getDataFromApi()
      }, 1000),
      filter: {
        handler () {
          this.getDataFromApi()
        },
        deep: true
      }
    },
    methods: {
      openExercise (exercise) {
        this.$router.push({
          name: 'Exercise',
          params: { id: exercise.id }
        })
      },
      getDataFromApi () {
        this.loading = true
        const { sortBy, sortDesc, page, itemsPerPage } = this.options

        return this.$http({
          url: API_EXERCISES,
          method: 'Get',
          params: {
            page: page - 1,
            size: itemsPerPage,
            sort: sortBy[0],
            direction: sortDesc[0] ? 'desc' : 'asc',
            filter: this.search,
            from: lodash.get(this.filter, 'from.id'),
            to: lodash.get(this.filter, 'to.id'),
            tag: lodash.get(this.filter, 'tag.id')
          }
        }).then(data => {
          this.loading = false
          this.exercises = data.items
          this.totalExercises = data.totalPages
        }).catch(response => {
          this.loading = false
          this.exercises = []
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