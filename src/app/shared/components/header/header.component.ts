import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RxjsSharedService } from '../../services/rxjs-shared.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  private rxjsSharedService = inject(RxjsSharedService);

  // Exposed as Observable so the template uses async pipe (auto-unsubscribes)
  headerMessage$ = this.rxjsSharedService.headerMessage$;
}
