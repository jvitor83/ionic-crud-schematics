import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription, Observable } from 'rxjs';
import { LoadingController, AlertController } from '@ionic/angular';
import { AlertOptions, AlertButton } from '@ionic/core';
import { <%= classify(name) %> } from './<%= camelize(name) %>.model';
import { <%= classify(name) %>Service } from './<%= camelize(name) %>.service';

@Component({
  selector: '<%= selector %>',
  templateUrl: './<%= dasherize(name) %>.view-page.html',
  styleUrls: ['./<%= dasherize(name) %>.view-page.<%= styleext %>'],
})
export class <%= classify(name) %>ViewPage implements OnInit, OnDestroy {

  <%= camelize(name) %>: <%= classify(name) %> = <any>{ };

  // All subscription must be unsubscribed at ngOnDestroy
  paramMapSubscription: Subscription;
  readSubscription: Subscription;

  constructor(
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private <%= camelize(name) %>Service: <%= classify(name) %>Service
  ) {

  }

  ngOnInit() {
    this.paramMapSubscription = this.activatedRoute.paramMap.subscribe(paramMap => {
      const <%= camelize(name) %>Id = paramMap.get('<%= camelize(name) %>Id');

      if (<%= camelize(name) %>Id) {
        this.read(<%= camelize(name) %>Id);
      }
    });
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

  ngOnDestroy() {
    if (this.paramMapSubscription) {
      this.paramMapSubscription.unsubscribe();
    }
    if (this.readSubscription) {
      this.readSubscription.unsubscribe();
    }
  }

}
