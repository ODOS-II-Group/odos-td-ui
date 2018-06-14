import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { ResourceManagerService } from './resource-manager.service';
import { BuildingInfo, RoomInfo, EquipmentInfo } from '../conference-room';

@Injectable()
export class ResourceModalService {
    private ngbModalRef: NgbModalRef;
    private equipmentInfo: EquipmentInfo;

    constructor(
        private modalService: NgbModal,
        private router: Router,
        private resourceManagerService: ResourceManagerService
    ) {
        this.ngbModalRef = null;
    }

    open(component: Component, resource: string, id?: number | any): Promise<NgbModalRef> {
        return new Promise<NgbModalRef>((resolve, reject) => {
            const isOpen = this.ngbModalRef !== null;
            if (isOpen) {
                resolve(this.ngbModalRef);
            }

            if (resource === 'Building' && id) {
                this.resourceManagerService.getBuildingById(id).subscribe((response) => {
                    this.ngbModalRef = this.buildingModalRef(component, <BuildingInfo>response);
                    resolve(this.ngbModalRef);
                });
            }
          
            if (resource === 'ConferenceRoom' && id) {
                this.resourceManagerService.getConferenceRoomById(id).subscribe((response) => {
                    this.ngbModalRef = this.conferenceRoomModalRef(component, <RoomInfo>response);
                    resolve(this.ngbModalRef);
                });
            }
            if (resource === 'Equipment' && id) {
                this.resourceManagerService.getEquipmentById(id).subscribe((response) => {
                    this.ngbModalRef = this.equipmentModalRef(component, <EquipmentInfo>response);
                    resolve(this.ngbModalRef);
                });
            }
            if (resource === 'Equipment' && !id) {
                const equipmentInfo = new EquipmentInfo(0, "", "");
                this.ngbModalRef = this.equipmentModalRef(component, equipmentInfo);
                resolve(this.ngbModalRef);
            }
        });
    }

    buildingModalRef(component: Component, building: BuildingInfo): NgbModalRef {
        const modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.building = building;
        modalRef.result.then((result) => {
            this.router.navigate([{ outlets: { popup: null }}], { replaceUrl: true, queryParamsHandling: 'merge' });
            this.ngbModalRef = null;
        }, (reason) => {
            this.router.navigate([{ outlets: { popup: null }}], { replaceUrl: true, queryParamsHandling: 'merge' });
            this.ngbModalRef = null;
        });
        return modalRef;
    }
  
    conferenceRoomModalRef(component: Component, conferenceRoom: RoomInfo): NgbModalRef {
        const modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.conferenceRoom = conferenceRoom;
        modalRef.result.then((result) => {
            this.router.navigate([{ outlets: { popup: null }}], { replaceUrl: true, queryParamsHandling: 'merge' });
            this.ngbModalRef = null;
        }, (reason) => {
            this.router.navigate([{ outlets: { popup: null }}], { replaceUrl: true, queryParamsHandling: 'merge' });
            this.ngbModalRef = null;
        });
        return modalRef;
    }
  
    equipmentModalRef(component: Component, equipment: EquipmentInfo): NgbModalRef {
        const modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.equipment = equipment;
        modalRef.result.then((result) => {
            this.router.navigate([{ outlets: { popup: null }}], { replaceUrl: true, queryParamsHandling: 'merge' });
            this.ngbModalRef = null;
        }, (reason) => {
            this.router.navigate([{ outlets: { popup: null }}], { replaceUrl: true, queryParamsHandling: 'merge' });
            this.ngbModalRef = null;
        });
        return modalRef;
    }
}
