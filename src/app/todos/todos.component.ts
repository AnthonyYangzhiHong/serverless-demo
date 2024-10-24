import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { generateClient, type Client } from 'aws-amplify/api';
import { ListTodosQuery, Todo } from '../../API';
import * as mutations from '../../graphql/mutations';
import * as queries from '../../graphql/queries';
import * as subscriptions from '../../graphql/subscriptions'


@Component({
  standalone: true,
  selector: 'app-todos',
  imports: [ReactiveFormsModule],
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.scss']
})
export class TodosComponent implements OnInit, OnDestroy {
  public createForm: FormGroup;
  public client: Client;

  /* declare todos variable */
  public todos: ListTodosQuery['listTodos'];
  private subscription: any = null;

  constructor(private fb: FormBuilder) {
    this.createForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required]
    });

    this.client = generateClient() as any;
  }

  async ngOnInit() {
    /* fetch todos when app loads */
    try {
      const response = await this.client.graphql({
        query: queries.listTodos
      });
      this.todos = response.data.listTodos;
    } catch (e) {
      console.log('error fetching todos', e);
    }

    /* subscribe to new todos being created */
    this.subscription = this.client.graphql({
      query: subscriptions.onCreateTodo
    }).subscribe({
      next: (event: any) => {
        const newTodo = event.data.onCreateTodo;
        if(this.todos) {
          this.todos.items = [newTodo, ...this.todos.items];
        }
      }
    });
  }

  public async onCreate(todo: Todo) {
    try {
      const response = await this.client.graphql({
        query: mutations.createTodo,
        variables: {
          input: todo
        }
      });
      console.log('item created!', response);
      this.createForm.reset();
    } catch (e) {
      console.log('error creating todo...', e);
    }
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.subscription = null;
  }
}