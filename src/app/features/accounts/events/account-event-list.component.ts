import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IAccountEvent } from '../models/account-event.models';
import { AccountService } from '../services/account.service';
import { LoggingService } from '../../../core/services/logging.service';
import { formatDate, formatValue } from '../../../core/utilities/utilities';

@Component({
  selector: 'app-account-event-list',
  templateUrl: './account-event-list.component.html',
  standalone: true,
  imports: [CommonModule],
})
export class AccountEventListComponent implements AfterViewInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private accountService = inject(AccountService);
  private logger = inject(LoggingService);

  accountName: string;
  fromDate: Date;
  toDate: Date;
  pageSize: number;
  accountEvents: IAccountEvent[] = [];
  loading = true;
  pageIndex = 0;
  totalEvents: number | null = null;
  formatDate = formatDate;
  formatValue = formatValue;

  private observer!: IntersectionObserver;

  @ViewChild('loadMoreTrigger', { static: false }) loadMoreTrigger!: ElementRef;

  constructor() {
    const state = this.route.snapshot.queryParams;
    this.accountName = state['accountName'];
    this.fromDate = new Date(state['fromDate']);
    this.toDate = new Date(state['toDate']);
    this.pageSize = state['pageSize'];
  }

  ngAfterViewInit(): void {
    this.loadMoreEvents();
  }

  private setupObserver(): void {
    if (this.observer) return;

    this.observer = new IntersectionObserver((entries) => {
      const currentTotal = this.accountEvents.length;

      if (entries[0].isIntersecting && (!this.totalEvents || currentTotal < this.totalEvents)) {
        this.loadMoreEvents();
      }
    });

    this.observer.observe(this.loadMoreTrigger.nativeElement);
  }

  private loadMoreEvents(): void {
    this.accountService
      .getEventsPaginated(this.accountName, this.fromDate, this.toDate, this.pageIndex, this.pageSize)
      .subscribe({
        next: (data) => {
          const mappedAccountEvents = data.events.map((event: IAccountEvent) => ({
            account: event.account,
            eventDate: event.eventDate,
            description: event.description,
            amount: event.amount,
            category: event.category,
          }));

          this.totalEvents = data.totalEvents;
          this.accountEvents = [...this.accountEvents, ...mappedAccountEvents];
          this.pageIndex++;
          this.loading = false;

          if (!this.observer) {
            setTimeout(() => {
              this.setupObserver();
            }, 1000);
          }
        },
        error: (error) => {
          this.logger.sendLog({
            level: 'ERR',
            component: 'account-event-list.component',
            message: 'Error loading more events:' + error,
          });
        },
      });
  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}
