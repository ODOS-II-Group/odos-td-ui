import { Component, OnInit } from '@angular/core';
import { NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { JhiEventManager } from "ng-jhipster";
import {Router, ActivatedRoute, Params, Data, RouterStateSnapshot, ActivatedRouteSnapshot} from '@angular/router';


import { Account, LoginModalService, Principal } from "../shared";
import { ConferenceRoomService } from './conference-room.service';
import {StateStorageService} from "../shared/auth/state-storage.service";

@Component({
    selector: 'jhi-conference-room',
    templateUrl: './conference-room.component.html',
    styleUrls: [
        'conference-room.scss'
    ]

})
export class ConferenceRoomComponent implements OnInit {

    en: any;
    date10: Date;
    date: Date;

    account: Account;
    modalRef: NgbModalRef;
    buildingInfo= {};
    selectedRoom: string;
    buildingName: string;

    constructor(
        private principal: Principal,
        private loginModalService: LoginModalService,
        private eventManager: JhiEventManager,
        private route: ActivatedRoute,
        private conferenceRoomService: ConferenceRoomService,
        private router: Router,
        private stateStorageService: StateStorageService
    ) {
        this.en = {
            firstDayOfWeek: 0,
            dayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            dayNamesShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
            dayNamesMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
            monthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
            monthNamesShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            today: 'Today',
            clear: 'Clear'
        }



    }



    ngOnInit() {
        this.route.params.subscribe((params: Params) => this.getBuildigInfo(params['id']));
        this.route.snapshot.data['type'];

        this.principal.identity().then((account) => {
            this.account = account;
        });

        this.registerAuthenticationSuccess();
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Promise<boolean> {

        const authorities = route.data['authorities'];
        // We need to call the checkLogin / and so the principal.identity() function, to ensure,
        // that the client has a principal too, if they already logged in by the server.
        // This could happen on a page refresh.
        return this.checkLogin(authorities, state.url);
    }

    checkLogin(authorities: string[], url: string): Promise<boolean> {
        const principal = this.principal;
        return Promise.resolve(principal.identity().then((account) => {

            if (!authorities || authorities.length === 0) {
                return true;
            }

            if (account) {
                return principal.hasAnyAuthority(authorities).then((response) => {
                    if (response) {
                        return true;
                    }
                    return false;
                });
            }

            this.stateStorageService.storeUrl(url);
            this.router.navigate(['accessdenied']).then(() => {
                // only show the login dialog, if the user hasn't logged in yet
                if (!account) {
                    this.loginModalService.open();
                }
            });
            return false;
        }));
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

    getBuildigInfo(buildingNumber: Number){

        this.conferenceRoomService.getBuildingData(buildingNumber).subscribe(
            (response) => {
                this.buildingInfo = response;
                this.selectedRoom = this.buildingInfo['conferenceRooms'][0];
            },
            (error) => {
                console.log(error);
            }
        )
    }

}
