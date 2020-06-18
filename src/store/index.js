import Vue from "vue";
import Vuex from "vuex";
import Axios from "axios";
import { isEmpty } from "lodash";

Vue.use(Vuex);

const initialState = {
  cars:[
    {
        id:0,
        brand: 'Proton',
        models:[
            {
                id:0,
                label: "X70"
            },
            {
                id:1,
                label: "Exora"
            },
            {
                id:2,
                label: "Inspira"
            },
            {
                id:3,
                label: "Iriz"
            },
            {
                id:4,
                label: "Perdana"
            },
            {
                id:5,
                label: "Persona"
            },
            {
                id:6,
                label: "Preve"
            },
            {
                id:7,
                label: "Saga"
            },
            {
                id:8,
                label: "others"
            }
        ]
    },
    {
        id:1,
        brand: 'Peodua',
        models:[
            {
                id:0,
                label: "Alza"
            },
            {
                id:1,
                label: "Aruz"
            },
            {
                id:2,
                label: "Axia"
            },
            {
                id:3,
                label: "Bezza"
            },
            {
                id:4,
                label: "MyVi"
            },
            {
                id:5,
                label: "Viva"
            },
            {
                id:6,
                label: "Others"
            }
        ]
    }
  ],
  inspections: [],
  message:{
    type: '',
    content: ''
  }
}

export default new Vuex.Store({
  state: {
    ...initialState
  },
  getters:{
    getInspections: state => state.inspections,
    getHourRange: state => state.hourRange,     // in the real case should get from backend
    getMinuteRange: state => state.minuteRange, // in the real case should get from backend
    getMessage: state => state.message,
  },
  mutations: {
    setInspections: (state, payload) => {
      state.inspections = payload
    },
    setMessage: (state, payload) => {
      state.message = payload
    }
  },
  actions: {
    loadInspections: ({commit}) => {
      Axios.get('http://localhost:3000/', {
          headers: {"Content-Type": "application/json"}
        }).then(response => {
            let data = response.data.data
            commit('setInspections', data)
        }).catch(err => {
          console.log({err})
        })
    },
    postNewInspection: ({commit, getters}, payload) => {
      console.log("sent post data >>>", payload);
      
      Axios.post('http://localhost:3000/inspection', payload)
      .then(response => {
          let savedData = response.data.data
          if(!isEmpty(savedData)){
            commit('setInspections', [...getters.getInspections, savedData])
            commit('setMessage', {
              type: 'success',
              content: response.data.message
            })
          }else{
            commit('setMessage', {
              type: 'error',
              content: response.data.message
            })
          }
          
      }).catch(err => {
        console.log({err})
      })
      
    }
  },
  modules: {}
});
