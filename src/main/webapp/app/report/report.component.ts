import { Component, OnInit } from '@angular/core';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';
import { ChartModule } from 'primeng/chart';
import { NgbDateStruct, NgbCalendar, NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { ConferenceRoomService } from '../conference-room/conference-room.service';
import { Account, LoginModalService, Principal } from '../shared';
import { ReportService } from "./report.service";
import { HomeService } from "../home/home.service";

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
    selectedRoom: {};
    confRoomId: Number;
    roomName: string;
    buildingInfo = {};

    constructor(
        private principal: Principal,
        private loginModalService: LoginModalService,
        private eventManager: JhiEventManager,
        private reportService: ReportService,
        private conferenceRoomService: ConferenceRoomService,
        private homeService: HomeService
    ) {
        this.data = {
            labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
            datasets: [
                {
                    label: 'Number of Reservations',
                    backgroundColor: '#42A5F5',
                    borderColor: '#1E88E5',
                    data: [5, 10, 15, 20, 25, 30]
                },
                {
                    label: 'Number of Cancelations',
                    backgroundColor: '#9CCC65',
                    borderColor: '#7CB342',
                    data: [1, 3, 6, 9, 12, 15, 18, 21, 24, 27, 30]
                }
            ]
        }

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

    getBuildigInfo(buildingNumber: Number) {
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
    onChangeBuilding(selectedBuilding) {
        this.selectedRoom = selectedBuilding.conferenceRooms;
    }
    onChangeRoom(selectedRoomInfo) {
        console.log(selectedRoomInfo);
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
}
