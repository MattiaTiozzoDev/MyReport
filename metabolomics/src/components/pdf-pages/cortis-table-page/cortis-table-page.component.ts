import { Component, Input, OnInit } from '@angular/core';
import { NgClass } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { PageFooter } from '../../shared/page-footer/page-footer';
import { PageHeader } from '../../shared/page-header/page-header.component';
import { CustomersDataService } from '../../../services/customers-data.service';
import { DateTransformPipe } from '../../../pipes/date-transform.pipe';
import { RoundedValuePipe } from '../../../pipes/rounded-value.pipe';
import {
  CORTIS_LIMITS,
  CortisStatus,
  getCortisStatus,
} from '../../../configs/cortis-limits';

type CortisTableRow = {
  name: string;
  value: number | string;
  status: CortisStatus | null;
  range: string;
};

const formatLimit = (n: number) => n.toFixed(2).replace('.', ',');

type ChartPoint = { x: number; y: number };

type CortisChart = {
  xLabels: { x: number; label: string }[];
  ticks: { y: number; label: number }[];
  band: string;
  avgLine: string;
  avgDots: ChartPoint[];
  patientLine: string;
  patientDots: ChartPoint[];
};

// Area di tracciamento nel viewBox 460x150
const PLOT = { left: 40, right: 450, top: 12, bottom: 120 };

const toPoints = (pts: ChartPoint[]) =>
  pts.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');

@Component({
  selector: 'cortis-table-page',
  imports: [
    PageHeader,
    PageFooter,
    TranslatePipe,
    DateTransformPipe,
    NgClass,
    RoundedValuePipe,
  ],
  templateUrl: './cortis-table-page.component.html',
  styleUrl: './cortis-table-page.component.scss',
})
export class CortisTablePageComponent implements OnInit {
  public rows: CortisTableRow[] = [];
  public chart: CortisChart | null = null;
  public refDate: string | undefined;
  @Input() page: string;

  constructor(private customerDataService: CustomersDataService) {}

  ngOnInit(): void {
    this.customerDataService.$customerData.subscribe((data) => {
      this.refDate = data?.customer?.refDate;
      this.rows = (data?.values ?? []).map((el) => {
        const limit = CORTIS_LIMITS[el.id];
        return {
          name: el.name,
          value: el.value,
          status: getCortisStatus(el.id, el.value),
          range: limit
            ? `${formatLimit(limit.inf)} - ${formatLimit(limit.sup)}`
            : '',
        };
      });
      this.chart = this.buildChart(data?.values ?? []);
    });
  }

  private buildChart(values: any[]): CortisChart | null {
    const items = values.filter((el) => CORTIS_LIMITS[el.id]);
    if (items.length < 2) return null;

    const { left, right, top, bottom } = PLOT;
    const step = (right - left - 20) / (items.length - 1);
    const xs = items.map((_, i) => left + 10 + i * step);

    const nums = items.map((el) => Number(el.value));
    const sups = items.map((el) => CORTIS_LIMITS[el.id].sup);
    const peak = Math.max(...sups, ...nums.filter((n) => !isNaN(n)));
    const yMax = Math.max(12, Math.ceil(peak / 2) * 2);
    const y = (v: number) => bottom - (v / yMax) * (bottom - top);

    const upper = items.map((el, i) => ({
      x: xs[i],
      y: y(CORTIS_LIMITS[el.id].sup),
    }));
    const lower = items.map((el, i) => ({
      x: xs[i],
      y: y(CORTIS_LIMITS[el.id].inf),
    }));
    const avg = items.map((el, i) => ({
      x: xs[i],
      y: y((CORTIS_LIMITS[el.id].inf + CORTIS_LIMITS[el.id].sup) / 2),
    }));
    const patient = items
      .map((_, i) => (isNaN(nums[i]) ? null : { x: xs[i], y: y(nums[i]) }))
      .filter((p): p is ChartPoint => p !== null);

    return {
      xLabels: items.map((el, i) => ({
        x: xs[i],
        label: String(el.name).toLowerCase(),
      })),
      ticks: Array.from({ length: yMax / 2 + 1 }, (_, i) => ({
        y: y(i * 2),
        label: i * 2,
      })),
      band: toPoints([...upper, ...lower.reverse()]),
      avgLine: toPoints(avg),
      avgDots: avg,
      patientLine: toPoints(patient),
      patientDots: patient,
    };
  }
}
