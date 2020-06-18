<template>
  <div class="home">
    <div class="col-lg-10" style="padding-top: 20px">

      <b-alert 
        variant="success" 
        dismissible
        v-show="getMessage.type === 'success'"
        @dismissed='clearMessage()'
        show
        fade
        >{{getMessage.content}}</b-alert>

      <b-alert 
        variant="danger" 
        dismissible
        v-show="getMessage.type === 'error'"
        @dismissed='clearMessage()'
        show
        fade
        >{{getMessage.content}}</b-alert>

    </div>
    <b-container class="col-10" style="padding-top: 40px">
      <div>
        <b-button 
          variant="success" 
          @click="showModal()"
          >New Inspection</b-button>
          <b-modal id="new-inspection-modal" title="New Inspection" size="lg"  hide-footer>
            <Form @closeModal="hideModal('new-inspection-modal')"/>
          </b-modal>
        <b-modal id="time-limit-modal" hide-footer>
          <template v-slot:modal-title>Time Limitation!</template>
          <div class="d-block text-center">
            <h4>You can send just one inspection request per hour...</h4>
          </div>
          <div class="row">
            <div class="col-lg-3"></div>
            <div class="col-lg-6">
              <b-button class="mt-3" variant="outline-dark" block @click="$bvModal.hide('time-limit-modal')">Close</b-button>
            </div>
            <div class="col-lg-3"></div>
          </div>
        </b-modal>
      </div>
      <br/><br/>
      <List />
    </b-container>
  </div>
</template>

<script>

import List from "@/components/List.vue";
import Form from "@/components/Form.vue";
import { mapGetters, mapMutations } from "vuex";

export default {
  name: "Home",
  components: {
    List,
    Form
  },
  data(){
    return{
      timer: undefined
    }
  },
  watch:{
        getMessage: function name(newValue, oldValue) {
            let time = 5;
            if(newValue.content.length > 0){
                this.timer = setInterval(()=>{
                    if(time > 0){
                        time--;
                    }else{
                        this.clearMessage()
                    }
                }, 1000)
            }else{
                clearInterval(this.timer);
            }
        }
    },
  computed:{
    ...mapGetters(['getInspections', 'getMessage'])
  },
  methods:{
    ...mapMutations(['setMessage']),
    checkLastTimeStamp: function(params) {
        const inspections = this.getInspections || []
        console.log("count >>>", inspections.length);
        
        if(inspections.length > 0){
          console.log("Yessss...");
          
          let lastTimeStamp = ''
          inspections.forEach( item => {
            (item.timeStamp > lastTimeStamp) && (lastTimeStamp = item.timeStamp)
          }) 
          const nextSubmit = Date.parse(lastTimeStamp) + 3600000
          const now = new Date().getTime()
          console.log({now,nextSubmit});
          return now > nextSubmit
        }else{
          return true
        }
    },
    showModal: function() {
      this.checkLastTimeStamp() ?
        this.$bvModal.show('new-inspection-modal') :
        this.$bvModal.show('time-limit-modal')
    },
    hideModal: function(params) {
      this.$bvModal.hide(params)
    },
    clearMessage: function () {
      this.setMessage({
        type: "", 
        content: ""
      })
    }
    
  },
  mounted: function(){
    
  }
};
</script>
