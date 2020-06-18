<template>
    <div class="col-12" style="padding: 20px">
    <b-form @submit="postInspection" class="needs-validation" novalidate>
        <b-form-group
            id="fieldset-1"
            description="Let us know your name."
            label="Full Name"
            label-for="input-1"
            >
            <b-form-input 
                id="input-1" 
                v-model="form.name"  
                trim 
                required
                :state="validation.name"
                @blur="validateField('name')"
                aria-describedby="name-live-feedback"
                ></b-form-input>
                <b-form-invalid-feedback id="name-live-feedback">
                    Your name must have more than 3 characters long.
                </b-form-invalid-feedback>
    </b-form-group>
    <b-form-group
        id="fieldset-1"
        description="Enter your mobile number."
        label="Mobile Number"
        label-for="input-2"
        >
        <b-input-group prepend="+60">
            <b-form-input 
                id="input-2" 
                v-model="form.mobile" 
                trim
                required
                :state="validation.mobile"
                @blur="validateField('mobile')"
                aria-describedby="mobile-live-feedback"
                ></b-form-input>
                <b-form-invalid-feedback id="mobile-live-feedback">
                    Mobile field is required and should be a valid mobile number.
                </b-form-invalid-feedback>
        </b-input-group>
    </b-form-group>
    <div class="row">
        <div class="col-lg-6">
            <b-form-group 
            id="fieldset-1"
            label="Car Brand"
            label-for="input-2"
            >
             <b-dropdown
                :text="form.brand !== '' ? form.brand : 'Select'"
                split
                :split-variant="validation.brand === undefined ? 'outline-dark' : validation.brand === false ? 'outline-danger' :'outline-success' "
                block
                :state="validation.brand"
                aria-describedby="brand-live-feedback"
                >
                    <b-dropdown-item 
                        v-for="(car, index) in cars" 
                        :key="index" 
                        @click="selectBrand(car.brand)"
                        >{{car.brand}}</b-dropdown-item>
                        <b-form-invalid-feedback id="brand-live-feedback">
                            Please select your car brand
                        </b-form-invalid-feedback>
                </b-dropdown>

            </b-form-group>
        </div>
        <div class="col-lg-6">
            <b-form-group
                id="fieldset-1"
                label="Car Model"
                label-for="input-3"
                >
                <b-dropdown
                    :text="form.model !== '' ? form.model : 'Select'"
                    split
                    :split-variant="validation.model === undefined ? 'outline-dark' : validation.model === false ? 'outline-danger' :'outline-success' "
                    class="coll-lg-12"
                    :disabled="!validation.brand"
                    block
                    @click="validateField('brand')"
                    :state="validation.model"
                    aria-describedby="model-live-feedback"
                    >
                        <b-dropdown-item 
                            :text="form.model !== '' ? form.model : 'Select'"
                            v-for="model in form.models"
                            :key="model.id"
                            @click="selectModel(model.label)" 
                            >{{model.label}}</b-dropdown-item>
                            <b-form-invalid-feedback id="model-live-feedback">
                                Please select your car model
                            </b-form-invalid-feedback>
                    </b-dropdown>
                </b-form-group>
            </div>
        </div>
        <b-form-group
        id="fieldset-1"
        description="Select the inspection date."
        label="Inspection Date"
        label-for="input-"
            >
            <b-form-datepicker 
                v-model="form.date" 
                :date-disabled-fn="dateDisabled" 
                :state="validation.date"
                @hidden="validateField('date')"
                aria-describedby="date-live-feedback"
                ></b-form-datepicker>
                <b-form-invalid-feedback id="mobile-live-feedback">
                    Please select the date of your car's Inspection.
                </b-form-invalid-feedback>
        </b-form-group>
        <div>
            <div class="row">
                <div style="padding: 5px 0 0 16px;">
                    <label style="font-size: 14pt">Inspection Time</label>
                </div>
                <div style="display: flex; flex-direction: column; margin-left: 30px;">
                    <b-button-group aria-describedby="time-live-feedback">
                        <b-dropdown 
                            :text="form.hour !== '' ? form.hour : 'Hour'"
                            :variant="validation.hour === undefined ? 'outline-dark' : validation.hour === false ? 'outline-danger' :'outline-success' " 
                            :disabled="!validation.date"
                            right 
                            split 
                            >
                            <b-dropdown-item  
                                v-for="(hour, index) in hourRange" 
                                :key="index"
                                @click="setHour(hour)" 
                                >{{hour}}</b-dropdown-item>
                        </b-dropdown>
                        <b-dropdown 
                            :text="form.minute !== '' ? form.minute : 'Minute'"
                            :variant="validation.minute === undefined ? 'outline-dark' : validation.minute === false ? 'outline-danger' :'outline-success' " 
                            :disabled="!validation.date"
                            right 
                            split 
                            >
                            <b-dropdown-item  
                                v-for="(minute, index) in minuteRange" 
                                :key="index"
                                @click="setMinute(minute)" 
                                >{{minute}}</b-dropdown-item>
                        </b-dropdown>
                    </b-button-group>
                </div>
            </div>
            <div v-if="timeError">
                <span style="font-size: 80%; color: #dc3545; margin: 3px 0 0 1px;">Your selected Date&Time is full, please select different Time.</span>
            </div>
        </div>
        <div style="margin: 30px 0">
            <b-form-checkbox
                id="checkbox-1"
                v-model="form.agreement"
                name="checkbox-1"
                >
                I have read & agreed to Carsome's Privacy Policy and Terms of Use
            </b-form-checkbox>
        </div>
        </b-form>
    <br />
        <b-alert 
            v-if="showMessage" 
            variant="danger" 
            show 
            fade
            dismissible
            @dismissed="showMessage = false"
            >{{message}}</b-alert>
        <b-button :disabled="!form.agreement" @click="postInspection" block variant="warning">Register</b-button>
    </div>
</template>

<script>

import axios from "axios";
import { isEmpty } from "lodash";
import { mapGetters, mapMutations, mapActions } from "vuex";

export default {
    name: "Form",
    data(){
        return{
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
            hourRange: ['09','10','11','12','13','14','15','16','17'],
            minuteRange: ['00', '30'],
            form:{
                name: '',
                mobile: '',
                brand: '',
                model: '',
                models: [],
                date: '',
                hour: '',
                minute: '',
                agreement: false
            },
            validation:{
                name: undefined,
                mobile: undefined,
                brand: undefined,
                model: undefined,
                date: undefined,
                hour: undefined,
                minute: undefined,
            },
            showMessage: false,
            message: '',
            currentDateTimes: [],
            timeError: false,
            timer: undefined,
        }
    },
    computed:{
        ...mapGetters(['getInspections']),
        time: function() {
            return `${this.form.hour}:${this.form.minute}`
        }
    },
    watch:{
        'form.date': function(newValue, oldValue) {
            const selectedDate = newValue
            let filteredInspections = this.getInspections;
            const list = filteredInspections.filter(item => {
                const itemDate = new Date(item.date)
                return (this.formatDate(itemDate) === selectedDate)
            })
            let times = list.map(item => item.time)
            this.currentDateTimes = times
            this.checkTime()  
        },
        showMessage: function name(newValue, oldValue) {
            let time = 5;
            if(newValue === true){
                this.timer = setInterval(()=>{
                    if(time > 0){
                        time--;
                    }else{
                        this.showMessage = false;
                        this.message = '';
                    }
                }, 1000)
            }else{
                clearInterval(this.timer);
            }
        }
    },
    methods:{
        ...mapActions(['postNewInspection']),
        selectBrand: function(brand){
            this.form.brand = brand;
            this.validation.brand = true;
            this.form.models = this.cars.filter(car => car.brand === brand)[0].models;
        },
        selectModel: function(model){
            this.form.model = model;
            this.validation.model = true;
        },
        nDaysLater: function(startDate, n){
            const start = startDate.getTime();
            const endDate = start + (86400000 * n);
            return new Date(endDate);
        },
        dateDisabled(ydm, date) {
            const weekday = date.getDay();
            const currentDate = new Date();
            const maxDate = this.nDaysLater(currentDate, 21);
            const disabledDates = weekday === 0 || (date > maxDate) || (currentDate > date);
            return disabledDates
        },
        setHour: function(hour) {
            const inspections = this.getInspections;
            this.form.hour = hour;
            this.validation.hour = true;
            this.checkTime()  
        },
        setMinute: function(minute) {
            this.form.minute = minute;
            this.validation.minute = true;
            this.checkTime()         
        },
        checkTime: function() {
            if(!!this.form.hour && !!this.form.minute){
                const count = this.currentDateTimes.includes(this.time) && this.currentDateTimes.filter(item => item === this.time).length;
                const weekday = new Date(this.form.date).getDay();
                console.log({weekday});
                const dayLimitation = weekday === 6 ? 3 : 1;
                if(count > dayLimitation){
                    this.validation.hour = false;
                    this.validation.minute = false;
                    this.timeError = true;
                }else{
                    this.timeError = false;
                    (this.validation.hour === false) && (this.validation.hour = true);
                    (this.validation.minute === false) && (this.validation.minute = true);
                }
            }
        },
        validateField: function(field) {
            switch (field) {
                case 'name':
                    this.validation.name = this.form.name.length > 3 ? true : false;
                    break;
                case 'mobile':
                    this.validation.mobile = this.form.mobile.length >= 9 && Number(this.form.mobile.length) ? true : false;
                    break;
                case 'brand':
                    this.validation.brand = this.form.brand !== '' ? true : false;
                    break;
                case 'model':
                    this.validation.model = this.form.model !== '' ? true : false;
                    break;
                case 'date':
                    this.validation.date = this.form.date !== '' ? true : false;
                    break;
                case 'hour':
                    this.validation.hour = this.form.hour !== '' ? true : false;
                    break;
                case 'minute':
                    this.validation.minute = this.form.minute !== '' ? true : false;
                    break;
                default:
                    break;
            }
        },
        validateForm: function(params) {
                this.validateField('name');
                this.validateField('mobile');
                this.validateField('brand');
                this.validateField('model');
                this.validateField('hour');
                this.validateField('date');
                this.validateField('hour');
                this.validateField('minute');
        },
        postInspection: function () {
            const {
                name,
                mobile,
                brand,
                model,
                date,
                hour,
                minute,
                agreement
            } = this.form;

            const formObject = {
                name: name, 
                mobile: mobile.substr(0,1) === '0' ? `+60${mobile.substr(1)}` : `+60${mobile}`,
                brand: brand,
                model: model,
                date: new Date(date),
                time: this.time
            }

            this.validateForm()
            
            const formfilled = this.validation.name && 
                this.validation.mobile && 
                this.validation.brand && 
                this.validation.model && 
                this.validation.date && 
                this.validation.hour && 
                this.validation.minute &&
                !this.timeError

                console.log({formfilled});
                

            if(formfilled){
                try {
                    this.postNewInspection(formObject);
                    this.closeModal();
                } catch (error) {
                    console.log(error);
                }
            }else{
                this.showMessage = true;
                if(this.timeError){
                    this.message = 'Your selected Date&Time is full, please select different Time.'
                } else{
                    this.message = 'Please complete the form...'
                }
            }
                
        },
        closeModal: function() {
            this.$emit('closeModal');
        },
        alert: function(params) {
            alert(params);
        },
        formatDate: function(date) {
            const year = date.getFullYear();
            const month = date.getMonth() < 9 ? `0${(date.getMonth() + 1)}` : (date.getMonth() + 1);
            const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();  
            return year+'-'+month+'-'+day
        },
    },
    mounted(){
        
        
    }

};
</script>

<style lang="scss" scoped>
    
</style>