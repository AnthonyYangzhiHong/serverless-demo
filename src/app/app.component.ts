import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TodosComponent } from './todos/todos.component';
import AmplifyAuthenticator, { AmplifyAuthenticatorModule } from '@aws-amplify/ui-angular';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TodosComponent, AmplifyAuthenticatorModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'amplify-app-1';
}
