import { Routes } from '@angular/router';
import { RoleAssignmentComponent } from './role-assignment/role-assignment.component';
import { RoleDefinitionComponent } from './role-definition/role-definition.component';
import { RoleTransferComponent } from './role-transfer/role-transfer.component';

export const ROLE_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'role-definition',
    pathMatch: 'full'
  },
  {
    path: 'role-definition',
    component: RoleDefinitionComponent,
    data: { title: 'Role Definition' }
  },
  {
    path: 'role-assignment',
    component: RoleAssignmentComponent,
    data: { title: 'Role Assignment' }
  },
  {
    path: 'role-transfer',
    component: RoleTransferComponent,
    data: { title: 'Role Transfer' }
  }
];
