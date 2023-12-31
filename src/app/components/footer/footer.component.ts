import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `<footer class="footer">
    <div class="footer__container">
      <p class="text-muted">
        Created by:
        <a href="https://github.com/87brandonn" target="_blank">
          Brandon Pardede</a
        >
        and
        <a href="https://github.com/WodenWang820118" target="_blank"
          >Guan Xin Wang</a
        >
      </p>
      <p class="text-muted">
        Contact:
        <a href="mailto:guanxin.wang@fifty-five.com"
          >guanxin.wang&#64;fifty-five.com</a
        >
      </p>
      <p class="text-muted">
        <a
          href="https://github.com/WodenWang820118/gtm-config-generator"
          target="_blank"
          >View on GitHub (gtm-config-generator module)</a
        >
      </p>
      <p class="text-muted">Last updated on: 2023-08-07</p>
    </div>
  </footer> `,
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent {}
