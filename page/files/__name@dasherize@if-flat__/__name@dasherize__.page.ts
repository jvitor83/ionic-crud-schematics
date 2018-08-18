import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription, Observable } from 'rxjs';
import { LoadingController, AlertController } from '@ionic/angular';
import { AlertOptions, AlertButton } from '@ionic/core';
import { <%= classify(name) %> } from './<%= camelize(name) %>.model';
import { <%= classify(name) %>Service } from './<%= camelize(name) %>.service';

@Component({
  selector: '<%= selector %>',
  templateUrl: './<%= dasherize(name) %>.page.html',
  styleUrls: ['./<%= dasherize(name) %>.page.<%= styleext %>'],
})
export class <%= classify(name) %>Page implements OnInit, OnDestroy {

  public <%= camelize(name) %>Array: <%= classify(name) %>[] = [];

  // All subscription must be unsubscribed at ngOnDestroy
  protected arraySubscription: Subscription;
  protected paramMapSubscription: Subscription;

  constructor(
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private <%= camelize(name) %>Service: <%= classify(name) %>Service
  ) {

  }

  ngOnInit() {
    this.paramMapSubscription = this.activatedRoute.paramMap.subscribe(paramMap => {
      // Get params from url here (like parentId - ex: 'parent/1/<%= camelize(name) %>')

      this.getList();
    });
  }

  protected getList() {
    const loadingPromise = this.loadingController.create();
    loadingPromise.then(r => r.present());

    const arrayObservable: Observable<any> = this.<%= camelize(name) %>Service.getAll();

    this.arraySubscription = arrayObservable.subscribe(<%= camelize(name) %> => {
      this.<%= camelize(name) %>Array = <%= camelize(name) %>;
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

    this.arraySubscription.add(() => loadingPromise.then(loading => loading.dismiss()));
  }

  ngOnDestroy() {
    if (this.paramMapSubscription) {
      this.paramMapSubscription.unsubscribe();
    }
    if (this.arraySubscription) {
      this.arraySubscription.unsubscribe();
    }
  }

}
