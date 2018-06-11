import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { ResourceModalService } from './resource-modal.service';
import { ResourceManagerService } from './resource-manager.service';
import { BuildingInfo, RoomInfo, EquipmentInfo } from '../conference-room';

@Component({
    selector: 'jhi-resource-mgmt-building-dialog',
    templateUrl: './resource-manager-building-dialog.component.html'
})
export class ResourceBuildingDialogComponent implements OnInit {

    building: BuildingInfo;
    isSaving: Boolean;

    constructor(
        public activeModal: NgbActiveModal,
        private resourceManagerService: ResourceManagerService,
        private eventManager: JhiEventManager
    ) {}

    ngOnInit() {
        this.isSaving = false;
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.building.buildingId !== null) {
            this.resourceManagerService.updateBuilding(this.building).subscribe((response) => this.onSaveSuccess(response), () => this.onSaveError());
        }
    }

    private onSaveSuccess(result) {
        this.eventManager.broadcast({ name: 'buildingListModification', content: 'OK' });
        this.isSaving = false;
        this.activeModal.dismiss(result.body);
    }

    private onSaveError() {
        this.isSaving = false;
    }
}

@Component({
    selector: 'jhi-resource-mgmt-conferenceroom-dialog',
    templateUrl: './resource-manager-conferenceroom-dialog.component.html'
})
export class ResourceConferenceRoomDialogComponent implements OnInit {

    conferenceRoom: RoomInfo;
    isSaving: Boolean;

    constructor(
        public activeModal: NgbActiveModal,
        private resourceManagerService: ResourceManagerService,
        private eventManager: JhiEventManager
    ) {}

    ngOnInit() {
        this.isSaving = false;
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.conferenceRoom.conferenceRoomId !== null) {
            this.resourceManagerService.updateConferenceRoom(this.conferenceRoom).subscribe((response) => this.onSaveSuccess(response), () => this.onSaveError());
        }
    }

    private onSaveSuccess(result) {
        this.eventManager.broadcast({ name: 'conferenceRoomListModification', content: 'OK' });
        this.isSaving = false;
        this.activeModal.dismiss(result.body);
    }

    private onSaveError() {
        this.isSaving = false;
    }
}

@Component({
    selector: 'jhi-resource-mgmt-equipment-dialog',
    templateUrl: './resource-manager-equipment-dialog.component.html'
})
export class ResourceEquipmentDialogComponent implements OnInit {

    equipment: EquipmentInfo;
    isSaving: Boolean;

    constructor(
        public activeModal: NgbActiveModal,
        private resourceManagerService: ResourceManagerService,
        private eventManager: JhiEventManager
    ) {}

    ngOnInit() {
        this.isSaving = false;
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.equipment.equipmentId !== null) {
            this.resourceManagerService.updateEquipment(this.equipment).subscribe((response) => this.onSaveSuccess(response), () => this.onSaveError());
        }
    }

    private onSaveSuccess(result) {
        this.eventManager.broadcast({ name: 'equipmentListModification', content: 'OK' });
        this.isSaving = false;
        this.activeModal.dismiss(result.body);
    }

    private onSaveError() {
        this.isSaving = false;
    }
}

@Component({
    selector: 'jhi-resource-dialog',
    template: ''
})
export class ResourceDialogComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private resourceModalService: ResourceModalService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['buildingId'] ) {
                this.resourceModalService.open(ResourceBuildingDialogComponent as Component, 'Building', params['buildingId']);
            }
            else if ( params['conferenceRoomId'] ) {
                this.resourceModalService.open(ResourceConferenceRoomDialogComponent as Component, 'ConferenceRoom', params['conferenceRoomId']);
            }
            else if ( params['equipmentId'] ) {
                this.resourceModalService.open(ResourceEquipmentDialogComponent as Component, 'Equipment', params['equipmentId']);
            } 
            else {
                this.resourceModalService.open(ResourceEquipmentDialogComponent as Component, 'Equipment'); // Create new Equipment
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
