<template>
  <div>
    <b-table striped hover :fields="fields" :items="getInspections">
        <template v-slot:cell(index)="data">
            {{ data.index + 1 }}
        </template>
        <template v-slot:cell(date)="data">
          <span>{{ formatDate(data.value)}}</span>
        </template>
    </b-table>
    <div 
      class="col-lg12" 
      v-show="getInspections.length < 1"
      >
      <div class=" row">
        <div class="col-lg-3"></div>
        <div class="col-lg-6 no-content-container" style="height: 200px">
          <img :src="logo">
          <h3 class="no-content-title">No Content</h3>
        </div>
        <div class="col-lg-3"></div>
      </div>
    </div>
    
  </div>
</template>

<script>
  import { mapState, mapGetters, mapActions } from "vuex";
  import logo from "../assets/logo-carsome-grey.png";
  import _ from "lodash";

  export default {
    data() {
      return {
          fields:[
            { key: 'index', label: 'Row' },
            { key: 'name', label: 'Full Name' },
            { key: 'mobile', label: 'Mobile Number' },
            { key: 'brand', label: 'Car Brand' },
            { key: 'model', label: 'Car Model' },
            { key: 'date', label: 'Inspection Date' },
            { key: 'time', label: 'Inspection Time' },
          ],
          logo: logo
      }
    },
    computed:{
        ...mapGetters(['getInspections']),
    },
    methods:{
      ...mapActions(['loadInspections']),
      formatDate: function(date) {
        let newDate = new Date(date)
        return (newDate.toLocaleString('default', { weekday: 'short' }) 
            + ', ' 
            + newDate.getUTCDate() 
            + ' ' 
            + newDate.toLocaleString('default', { month: 'long' }) 
            + ' ' 
            + newDate.getFullYear())
      }
    },
    mounted: function() {
        this.loadInspections()
        this.inspections = this.getInspections
        console.log(this.getInspections);
        
    }
  }
</script>


<style lang="scss" scoped>
  .no-content-container{
    align-items: center; 
    justify-content: center; 
    display: flex; 
    flex-direction: column;
    margin-top: 100px;
  }
  .no-content-title{
    color: #dadada;
    text-align: center;
    font-size: 30pt;
    font-weight: 600;
  }
</style>