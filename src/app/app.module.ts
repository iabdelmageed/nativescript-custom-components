import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core'
import { NativeScriptModule } from '@nativescript/angular'

import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { DemoComponent } from './editor/demo.component'
import { RichTextEditorComponent } from './rich-text-editor/rich-text-editor.component'
import { DropDownComponent } from './drop-down/drop-down.component';

@NgModule({
  bootstrap: [AppComponent],
  imports: [NativeScriptModule, AppRoutingModule],
  declarations: [AppComponent, DemoComponent, RichTextEditorComponent, DropDownComponent],
  providers: [],
  schemas: [NO_ERRORS_SCHEMA],
})
export class AppModule {}
