import { Component, OnInit } from '@angular/core';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';
import { ChartModule } from 'primeng/chart';
import { NgbDateStruct, NgbCalendar, NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { ConferenceRoomService } from '../conference-room/conference-room.service';
import { Account, LoginModalService, Principal } from '../shared';
import { ReportService } from "./report.service";
import { HomeService } from "../home/home.service";
import { ReservationService } from '../reservation/reservation.service';
import { Chart } from 'chart.js';


@Component({
    selector: 'jhi-report',
    templateUrl: './report.component.html',
    styleUrls: [
        'report.scss'
    ]
})
export class ReportComponent implements OnInit {

    data: any;
    filteredOption: string;
    account: Account;
    modalRef: NgbModalRef;
    filterBy: string;
    filterResult: any;
    filterOptions: string[] = ["Building Name", "Requester"];
    reportColumn = ["Building Name", "Conference room Name", "Conference Title", "Reserver", "Time"];
    filterMapping = {
        "Building Name": "search/building/",
        "Requester": "search/user/"
    }
    selectedOption: string = this.filterOptions[0];

    buildings: any;
    selectedRoom: any;
    confRoomId: Number;
    roomName: string;
    buildingInfo = {};
    roomScheduled: any;
    roomVacancy: number[] = [];
    chartLable: string[] = [];
    roomIds: any[] = [];
    buldingName: string;
    roomOcupancy: any[] = [];
    roomMap : Map<Number, string> = new Map<Number, string>();
    maxOccupancyPerDay: number = 32;
    chart = [];
    showChart: boolean = false;


    constructor(
        private principal: Principal,
        private loginModalService: LoginModalService,
        private eventManager: JhiEventManager,
        private reportService: ReportService,
        private conferenceRoomService: ConferenceRoomService,
        private homeService: HomeService,
        private reservationService: ReservationService
    ) {
        this.homeService.getAllBuildingData().subscribe(
            (response) => {
                this.buildings = response;
            },
            (error) => {
                console.log(error);
            }
        )
    }

    ngOnInit() {
        this.principal.identity().then((account) => {
            this.account = account;
        });
        this.registerAuthenticationSuccess();
    }

    private getBuildigInfo(buildingNumber: Number) {
        this.conferenceRoomService.getBuildingData(buildingNumber).subscribe(
            (response) => {
                this.buildingInfo = response;
                this.selectedRoom = this.buildingInfo['conferenceRooms'][0];
                this.confRoomId = +this.selectedRoom['conferenceRoomId'];
            },
            (error) => {
                console.log(error);
            }
        )
    }
    private getRoomReservationCount(param: Number) {
        this.reportService.getRoomReservationCount(param).subscribe(
            (response) => {
                const responceCount =  Number(response);
                const occupancyRate =  (responceCount / this.maxOccupancyPerDay) * 100;
                const vacancyRate = (this.maxOccupancyPerDay - responceCount) * (100 / this.maxOccupancyPerDay);
                this.roomOcupancy.push(occupancyRate);
                this.chartLable.push(this.roomMap.get(param));
                this.roomVacancy.push(vacancyRate);
                this.populateChart();
            },
            (error) => {
                console.log(error);
            }
        )
    }
    private onChangeBuilding(selectedBuilding) {
        this.roomOcupancy.length = 0;
        this.roomVacancy.length = 0;
        this.selectedRoom = selectedBuilding.conferenceRooms;
        this.buldingName = selectedBuilding.buildingName;
        this.roomIds.length = 0;
        this.chartLable.length = 0;
        this.showChart = true;
        this.getRoomInfo();
        for(const id of this.roomIds){
            this.getRoomReservationCount(id);
        }
    }

    populateChart(){
        this.chart = new Chart('canvas', {
            type: 'line',
            data: {
                labels: this.chartLable,
                datasets: [
                    {
                        label: 'Ocupancy',
                        data: this.roomOcupancy,
                        backgroundColor: '#42A5F5',
                        borderColor: '#1E88E5',
                        fill: false
                    },
                    {
                        label: 'Vacancy',
                        data: this.roomVacancy,
                        backgroundColor: '#9CCC65',
                        borderColor: '#7CB342',
                        fill: false
                },
              ]
        },
            options: {
                legend: {
                    display: true
                },
                scales: {
                    xAxes: [{
                        display: true
                    }],
                    yAxes: [{
                        display: true,
                         ticks: {
                            callback: (value, index, values) => {
                                return '%' + value;
                            }
                        }
                    }],
                }
            }
          });
     }

    private getRoomInfo() {
        for (const room of this.selectedRoom) {
            this.roomIds.push(room.conferenceRoomId);
            this.roomMap.set(room.conferenceRoomId, room.roomName);
            console.log("map " + this.roomMap);
        }
    }

    private onChangeRoom(selectedRoomInfo) {
        this.confRoomId = selectedRoomInfo.conferenceRoomId;
        this.roomName = selectedRoomInfo.roomName;
    }
    
    registerAuthenticationSuccess() {
        this.eventManager.subscribe('authenticationSuccess', (message) => {
            this.principal.identity().then((account) => {
                this.account = account;
            });
        });
    }

    isAuthenticated() {
        return this.principal.isAuthenticated();
    }

    login() {
        this.modalRef = this.loginModalService.open();
    }

    searchBy(filterBy: string) {

        console.log("filter by", this.filterMapping[this.selectedOption], filterBy);
        return this.reportService.getSearchResult(this.filterMapping[this.selectedOption] + filterBy).subscribe(
            (response) => {
                this.filterResult = response;
            },
            (error) => {
                this.filterResult = [];
                console.log(error);
            }
        )
    }

    private  getRoomScheduledDetails(){

        this.reservationService.getRoomReservationById(this.confRoomId).subscribe(
            (response) => {
                this.roomScheduled = response                  
            },
            (error) => {
                console.log(error);
            }
        )
    }
    printPdf(){
        window.print();
    }
}
