import { Component, OnInit, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription, Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import {
  PopoverController, LoadingController, AlertController, ActionSheetController,
  MenuController, ModalController, NavController, ToastController
} from '@ionic/angular';
import { AlertOptions, AlertButton } from '@ionic/core';

@Component({
  selector: '<%= selector %>',
  templateUrl: './<%= dasherize(name) %>.page.html',
  styleUrls: ['./<%= dasherize(name) %>.page.<%= styleext %>'],
})
export class <%= classify(name) %>Page implements OnInit, OnDestroy {

  <%= camelize(name) %> = {
    id: null,
    // Put default values here
    name: ''
  };

  // All subscription must be unsubscribed at ngOnDestroy
  paramMapSubscription: Subscription;
  readSubscription: Subscription;
  createSubscription: Subscription;
  updateSubscription: Subscription;
  deleteSubscription: Subscription;


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ngLocation: Location,
    private actionSheetController: ActionSheetController,
    private alertController: AlertController,
    private popoverController: PopoverController,
    private toastController: ToastController,
    private loadingController: LoadingController,
    private menuController: MenuController,
    private modalController: ModalController,
    private navController: NavController,
    private <%= camelize(name) %>Service: <%= classify(name) %>Service // Create your Model Service
  ) {

  }

  ngOnInit() {
    this.paramMapSubscription = this.route.paramMap.subscribe(paramMap => {
      const <%= camelize(name) %>Id = paramMap.get('<%= camelize(name) %>Id');

      if (<%= camelize(name) %>Id) {
        this.read(<%= camelize(name) %>Id);
      } else {
        throw new Error('Parameter "teste1Id" not informed!');
      }
    });
  }

  save(<%= camelize(name) %>) {
    if (<%= camelize(name) %>.id) {
      this.update(<%= camelize(name) %>);
    } else {
      this.create(<%= camelize(name) %>);
    }
  }

  protected read(<%= camelize(name) %>Id) {
    const loadingPromise = this.loadingController.create();
    loadingPromise.then(r => r.present());

    const readObservable: Observable<any> = this.<%= camelize(name) %>Service.get(<%= camelize(name) %>Id);

    this.readSubscription = readObservable.subscribe(<%= camelize(name) %> => {
      Object.assign(this.<%= camelize(name) %>, <%= camelize(name) %>);
    }, (error) => {
      this.alertController.create(<AlertOptions>{
        header: 'Error',
        message: 'There was an error fetching data! Please try again later.',
        buttons: [
          <AlertButton>{
            text: 'OK'
          }
        ]
      }).then(r => r.present());
    });

    this.readSubscription.add(() => loadingPromise.then(loading => loading.dismiss()));
  }

  protected create(<%= camelize(name) %>) {
    const loadingPromise = this.loadingController.create();
    loadingPromise.then(r => r.present());

    const createObservable = this.<%= camelize(name) %>Service.create(<%= camelize(name) %>);

    this.createSubscription = createObservable.subscribe((value) => {
      this.alertController.create(<AlertOptions>{
        header: 'Success',
        message: 'Successful registration!',
        buttons: [<AlertButton>{ text: 'OK' }]
      }).then(r => r.present());
    }, (error) => {
      this.alertController.create(<AlertOptions>{
        header: 'Error',
        message: 'There was an error creating data! Please try again later.',
        buttons: [<AlertButton>{ text: 'OK' }]
      }).then(r => r.present());
    });

    this.createSubscription.add(() => loadingPromise.then(loading => loading.dismiss()));
  }

  protected update(<%= camelize(name) %>) {
    const loadingPromise = this.loadingController.create();
    loadingPromise.then(r => r.present());

    const updateObservable = this.<%= camelize(name) %>Service.update(<%= camelize(name) %>);

    this.updateSubscription = updateObservable.subscribe((value) => {
      this.alertController.create(<AlertOptions>{
        header: 'Success',
        message: 'Changed successfully!',
        buttons: [<AlertButton>{ text: 'OK' }]
      }).then(r => r.present());
    }, (error) => {
      this.alertController.create(<AlertOptions>{
        header: 'Error',
        message: 'There was an error changing data! Please try again later.',
        buttons: [<AlertButton>{ text: 'OK' }]
      }).then(r => r.present());
    });

    this.updateSubscription.add(() => loadingPromise.then(loading => loading.dismiss()));
  }

  protected delete(<%= camelize(name) %>Id) {
    const loadingPromise = this.loadingController.create();
    loadingPromise.then(r => r.present());

    const deleteObservable = this.<%= camelize(name) %>Service.delete(<%= camelize(name) %>Id);

    this.deleteSubscription = deleteObservable.subscribe((value) => {
      this.alertController.create(<AlertOptions>{
        header: 'Success',
        message: 'Deleted successfully!',
        buttons: [<AlertButton>{ text: 'OK' }]
      }).then(r => r.present());
    }, (error) => {
      this.alertController.create(<AlertOptions>{
        header: 'Error',
        message: 'There was an error deleting data! Please try again later.',
        buttons: [<AlertButton>{ text: 'OK' }]
      }).then(r => r.present());
    });

    this.deleteSubscription.add(() => loadingPromise.then(loading => loading.dismiss()));
  }

  ngOnDestroy() {
    if (this.paramMapSubscription) {
      this.paramMapSubscription.unsubscribe();
    }
    if (this.readSubscription) {
      this.readSubscription.unsubscribe();
    }
    if (this.createSubscription) {
      this.createSubscription.unsubscribe();
    }
    if (this.updateSubscription) {
      this.updateSubscription.unsubscribe();
    }
    if (this.deleteSubscription) {
      this.deleteSubscription.unsubscribe();
    }
  }

}
