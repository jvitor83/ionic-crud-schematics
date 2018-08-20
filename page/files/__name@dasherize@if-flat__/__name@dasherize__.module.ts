import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { <%= classify(name) %>Page } from './<%= dasherize(name) %>.page';
import { <%= classify(name) %>ChangePage } from './<%= dasherize(name) %>-change/<%= dasherize(name) %>.change-page';
import { <%= classify(name) %>ViewPage } from './<%= dasherize(name) %>-view/<%= dasherize(name) %>.view-page';

const routes: Routes = [
  {
    path: '',
    component: <%= classify(name) %>Page
  },
  {
    path: 'create',
    component: <%= classify(name) %>ChangePage
  },
  {
    path: ':<%= camelize(name) %>Id/edit',
    component: <%= classify(name) %>ChangePage
  },
  {
    path: ':<%= camelize(name) %>Id',
    component: <%= classify(name) %>ViewPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [<%= classify(name) %>Page, <%= classify(name) %>ChangePage, <%= classify(name) %>ViewPage]
})
export class <%= classify(name) %>PageModule {}
