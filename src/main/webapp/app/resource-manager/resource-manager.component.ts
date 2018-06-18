import { Component, OnInit } from '@angular/core';
import { Principal } from '../shared';
import { ResourceManagerService } from './resource-manager.service';
import { JhiEventManager } from 'ng-jhipster';

@Component({
  selector: 'jhi-resource-manager',
  templateUrl: './resource-manager.component.html',
  styleUrls: [
    'resource-manager.scss'
  ]
})
export class ResourceManagerComponent implements OnInit {
  
  selectedResource:string;
  buildingsData:any;
  conferenceRoomsData:any;
  equipmentsData:any;
  
  resources = ["Building", "Conference Room", "Equipment"];
  
  constructor( private resourceManagerService:ResourceManagerService,
                private eventManager: JhiEventManager) { }
  
  ngOnInit() {
     this.selectedResource = this.resources[0];
     this.getAllBuildings();
     this.getAllConferenceRooms();
     this.getAllEquipmentRooms();
     this.registerChangeInResources();
  }
  
  registerChangeInResources() {
    this.eventManager.subscribe('buildingListModification', (response) => this.getAllBuildings());
    this.eventManager.subscribe('conferenceRoomListModification', (response) => this.getAllBuildings());
    this.eventManager.subscribe('equipmentListModification', (response) => this.getAllEquipmentRooms());
  }

  getAllBuildings(){
      this.resourceManagerService.getAllBuildingData().subscribe(
          (response) => {
              this.buildingsData = response;
          },
          (error) => {
              console.log(error);
          }
      )  
  }
  getAllConferenceRooms(){
    this.resourceManagerService.getAllConferenceRoomData().subscribe(
        (response) => {
            this.conferenceRoomsData = response;
        },
        (error) => {
            console.log(error);
        }
    )  
  }
  getAllEquipmentRooms(){
    this.resourceManagerService.getAllEquipmentData().subscribe(
        (response) => {
            this.equipmentsData = response;
        },
        (error) => {
            console.log(error);
        }
    )  
  }
}
