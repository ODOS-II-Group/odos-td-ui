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
    ocupancyData: number[] = [];
    vacancyData: number[] = [];
    chartLable: string[] = [];
    roomIds: any[] = [];
    buldingName: string;
    showChart: boolean = false;
    roomOcupancy = {};

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
                console.log(" response " + param + " " + response);
                this.roomOcupancy = response;
            },
            (error) => {
                console.log(error);
            }
        )
    }
    private onChangeBuilding(selectedBuilding) {
        this.ocupancyData.length = 0;
        this.vacancyData.length = 0;
        this.showChart = true;
        this.selectedRoom = selectedBuilding.conferenceRooms;
        this.buldingName = selectedBuilding.buildingName;
        this.roomIds.length = 0;
        this.chartLable.length = 0;
        this.getRoomInfo();
        for(const id of this.roomIds){
            this.getRoomReservationCount(id);
            console.log(this.ocupancyData);
        }
        console.log(this.roomOcupancy);
        this.populateChart();
    }

    private populateChart() {
        this.data = {
            labels: this.chartLable,
            datasets: [
                {
                    label: 'Ocupancy',
                    backgroundColor: '#42A5F5',
                    borderColor: '#1E88E5',
                    data: this.roomOcupancy
                },
                {
                    label: 'Vacancy ',
                    backgroundColor: '#9CCC65',
                    borderColor: '#7CB342',
                    data: this.vacancyData
                }
            ]
        };
    }

    private getRoomInfo() {
        for (const room of this.selectedRoom) {
            this.roomIds.push(room.conferenceRoomId);
            this.chartLable.push(room.roomName);
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
}
