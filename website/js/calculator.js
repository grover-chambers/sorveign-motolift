(function () {
  // ── MotoLift Financing Calculator ─────────────────────────────
  // Model: Spiro M1 Ekon, Cheche TailG, Tankvolt T21, Enzi G5 RADI
  // 18-month loan, two-phase daily installments
  // Phase 1: days 1–90 (higher rate)   Phase 2: days 91–540 (lower rate)

  var PREFIX = window.location.pathname.indexOf('/pages/') !== -1 ? '..' : '.';

  var PHASE1_DAYS = 90;
  var PHASE2_DAYS = 450;
  var TOTAL_DAYS  = 540;
  var AVG_DAILY_EARNINGS = 2500;

  // Tier configs — shared across all bikes
  var TIER_CONFIGS = [
    { name: 'Starter',  markup: 0.75,   deposits: [{ dep: 10000, ratio: 1.44 }] },
    { name: 'Standard', markup: 0.795, deposits: [{ dep:  5000, ratio: 1.60 }, { dep: 10000, ratio: 1.44 }] },
    { name: 'Plus',     markup: 0.84,  deposits: [{ dep: 10000, ratio: 1.44 }] },
    { name: 'Pro',      markup: 0.885, deposits: [{ dep: 15000, ratio: 1.30 }, { dep: 20000, ratio: 1.18 }] },
  ];

  var BIKES = [
    { id: 'spiro',    name: 'Spiro M1 Ekon',  cashPrice: 95000,  image: 'spiro/Spiro 450 M1 Ekon.jpg', d2: 270 },
    { id: 'cheche',   name: 'Cheche TailG',    cashPrice: 199999, image: 'cheche/cheche bike electric 13.jpg', d2: 585 },
    { id: 'tankvolt', name: 'Tankvolt T21',    cashPrice: 190000, image: 'tankvolt/TankVolt T21.jpg', d2: 555 },
    { id: 'enzi',     name: 'Enzi G5 RADI',    cashPrice: 229000, image: 'enzi/Enzi G5 (2).jpg', d2: 675 },
  ];

  function round5(n) { return Math.round(n / 5) * 5; }

  function computePlan(cashPrice, dep, ratio, markup) {
    var targetTotal = Math.round(cashPrice * (1 + markup));
    var raw_d2 = (targetTotal - dep) / (ratio * PHASE1_DAYS + PHASE2_DAYS);
    var raw_d1 = raw_d2 * ratio;
    var d1 = round5(raw_d1);
    var d2 = round5(raw_d2);
    var actualTotal = dep + (d1 * PHASE1_DAYS) + (d2 * PHASE2_DAYS);
    return { d1: d1, d2: d2, total: actualTotal, targetTotal: targetTotal };
  }

  function fmtKES(n) {
    return 'KES ' + Math.round(n).toLocaleString('en-KE');
  }

  // ── Full calculator (marketplace.html) ──────────────────────────

  function initFullCalculator() {
    var container = document.getElementById('motoCalc');
    if (!container) return;

    var activeBike = null;
    var activeTier = null;
    var activeDeposit = null;

    container.innerHTML =
      '<div style="max-width:1000px;margin:0 auto">' +
        '<span class="section-label">Financing Calculator</span>' +
        '<h2 style="margin-bottom:0.5rem">Calculate your plan</h2>' +
        '<p class="section-sub" style="margin-bottom:24px">Select a bike, choose your tier and deposit, and see your full payment breakdown.</p>' +

        '<div id="selectionRow" style="display:flex;gap:20px;margin-bottom:24px;flex-wrap:wrap">' +
          '<div id="bikeColumn" style="flex:0 0 180px;min-width:140px">' +
            '<p style="font-weight:600;font-size:0.8rem;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:10px">1. Choose bike</p>' +
            '<div id="bikeGrid" style="display:flex;flex-direction:column;gap:6px"></div>' +
          '</div>' +
          '<div id="tierDepositColumn" style="flex:1;min-width:260px">' +
            '<div id="tierSection" style="display:none">' +
              '<div style="display:flex;gap:20px;flex-wrap:wrap">' +
                '<div style="flex:1;min-width:180px">' +
                  '<p style="font-weight:600;font-size:0.8rem;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:10px">2. Select tier</p>' +
                  '<div id="tierGrid" style="display:grid;grid-template-columns:1fr 1fr;gap:8px"></div>' +
                '</div>' +
                '<div style="flex:1;min-width:140px">' +
                  '<p style="font-weight:600;font-size:0.8rem;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:10px">3. Deposit</p>' +
                  '<div id="depositPills" style="display:flex;gap:8px;flex-wrap:wrap"></div>' +
                  '<div id="depositHint" style="font-size:0.75rem;color:var(--text-muted);margin-top:6px;display:none"></div>' +
                '</div>' +
              '</div>' +
            '</div>' +
          '</div>' +
        '</div>' +

        '<div id="resultsPanel" style="display:none" aria-live="polite"></div>' +
      '</div>';

    var bikeGrid = document.getElementById('bikeGrid');
    var tierSection = document.getElementById('tierSection');
    var tierGrid = document.getElementById('tierGrid');
    var depositPills = document.getElementById('depositPills');
    var resultsPanel = document.getElementById('resultsPanel');

    // ── Render bike cards ──

    BIKES.forEach(function (bike) {
      var card = document.createElement('button');
      card.setAttribute('type', 'button');
      card.style.cssText =
        'background:var(--card);border:2px solid var(--border);border-radius:10px;' +
        'padding:8px;text-align:center;cursor:pointer;transition:all 0.2s ease;' +
        'font-family:var(--font-body);min-height:44px;display:flex;gap:10px;align-items:center';
      card.innerHTML =
        '<img src="' + PREFIX + '/images/' + bike.image + '" alt="' + bike.name + '"' +
        ' style="width:55px;height:55px;object-fit:cover;border-radius:8px;flex-shrink:0">' +
        '<div style="text-align:left;flex:1;min-width:0">' +
          '<p style="font-weight:600;font-size:0.75rem;color:var(--text);margin-bottom:1px;line-height:1.2;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">' + bike.name + '</p>' +
          '<p style="font-size:0.65rem;color:var(--green);margin:0">From ' + fmtKES(bike.d2) + '/d</p>' +
        '</div>';

      card.addEventListener('click', function () { selectBike(bike, card); });
      bikeGrid.appendChild(card);
    });

    function selectBike(bike, btn) {
      document.querySelectorAll('#bikeGrid button').forEach(function (b) {
        b.style.borderColor = 'var(--border)';
        b.style.background = 'var(--card)';
      });
      btn.style.borderColor = 'var(--green)';
      btn.style.background = '#e8f5ee';

      activeBike = bike;
      activeTier = null;
      activeDeposit = null;
      resultsPanel.style.display = 'none';

      tierSection.style.display = 'block';
      tierGrid.innerHTML = '';
      depositPills.innerHTML = '';
      document.getElementById('depositHint').style.display = 'none';

      TIER_CONFIGS.forEach(function (tc) {
        var minDep = tc.deposits[0].dep;
        var plan = computePlan(bike.cashPrice, minDep, tc.deposits[0].ratio, tc.markup);

        var card = document.createElement('button');
        card.setAttribute('type', 'button');
        card.style.cssText =
          'background:var(--card);border:2px solid var(--border);border-radius:10px;' +
          'padding:10px;text-align:center;cursor:pointer;transition:all 0.2s ease;' +
          'font-family:var(--font-body);min-height:44px';
        card.innerHTML =
          '<p style="font-weight:700;font-size:0.85rem;color:var(--text);margin-bottom:1px">' + tc.name + '</p>' +
          '<p style="font-size:0.7rem;color:var(--text-muted);margin-bottom:1px">' + fmtKES(plan.d2) + '/d after</p>' +
          '<p style="font-size:0.65rem;color:var(--green);font-weight:600">From ' + fmtKES(minDep) + '</p>';

        card.addEventListener('click', function () { selectTier(tc, card); });
        tierGrid.appendChild(card);
      });

      selectTier(TIER_CONFIGS[0], tierGrid.querySelector('button'));
    }

    function selectTier(tc, btn) {
      document.querySelectorAll('#tierGrid button').forEach(function (b) {
        b.style.borderColor = 'var(--border)';
        b.style.background = 'var(--card)';
      });
      btn.style.borderColor = 'var(--green)';
      btn.style.background = '#e8f5ee';

      activeTier = tc;
      activeDeposit = null;
      resultsPanel.style.display = 'none';

      depositPills.innerHTML = '';
      var hint = document.getElementById('depositHint');
      hint.style.display = 'none';

      if (tc.deposits.length === 1) {
        var d = tc.deposits[0];
        var pill = document.createElement('button');
        pill.setAttribute('type', 'button');
        pill.textContent = fmtKES(d.dep);
        pill.style.cssText =
          'padding:8px 18px;border:2px solid var(--green);background:#e8f5ee;' +
          'border-radius:99px;font-weight:600;font-family:var(--font-body);' +
          'font-size:0.8rem;cursor:not-allowed;opacity:0.7;min-height:38px';
        depositPills.appendChild(pill);
        selectDeposit(d);
      } else {
        tc.deposits.forEach(function (d) {
          var pill = document.createElement('button');
          pill.setAttribute('type', 'button');
          pill.textContent = fmtKES(d.dep);
          pill.style.cssText =
            'padding:8px 18px;border:2px solid var(--border);background:var(--card);' +
            'border-radius:99px;font-weight:600;font-family:var(--font-body);' +
            'font-size:0.8rem;cursor:pointer;transition:all 0.2s ease;min-height:38px';
          pill.addEventListener('click', function () {
            document.querySelectorAll('#depositPills button').forEach(function (b) {
              b.style.borderColor = 'var(--border)';
              b.style.background = 'var(--card)';
            });
            pill.style.borderColor = 'var(--green)';
            pill.style.background = '#e8f5ee';
            selectDeposit(d);
          });
          depositPills.appendChild(pill);
        });
        hint.textContent = 'Higher deposit = lower first-90 rate';
        hint.style.display = 'block';
      }
    }

    function selectDeposit(d) {
      activeDeposit = d;
      renderResults();
    }

    function renderResults() {
      if (!activeBike || !activeTier || !activeDeposit) return;

      var plan = computePlan(activeBike.cashPrice, activeDeposit.dep, activeDeposit.ratio, activeTier.markup);
      var phase1Total = plan.d1 * PHASE1_DAYS;
      var phase2Total = plan.d2 * PHASE2_DAYS;
      var total = plan.total;
      var dPct = ((activeDeposit.dep / total) * 100).toFixed(1);
      var p1Pct = ((phase1Total / total) * 100).toFixed(1);
      var p2Pct = ((phase2Total / total) * 100).toFixed(1);

      var surplus1 = AVG_DAILY_EARNINGS - plan.d1;
      var surplus2 = AVG_DAILY_EARNINGS - plan.d2;

      resultsPanel.innerHTML =
        '<div class="card" style="padding:20px">' +
          '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;flex-wrap:wrap;gap:6px">' +
            '<div>' +
              '<h3 style="margin-bottom:1px;font-size:1.05rem">' + activeBike.name + '</h3>' +
              '<p style="font-size:0.75rem;color:var(--text-muted);margin:0">' + activeTier.name + ' tier</p>' +
            '</div>' +
            '<span style="font-size:0.75rem;background:rgba(77,225,161,0.12);padding:3px 12px;border-radius:99px;font-weight:600;color:var(--text)">' + fmtKES(activeDeposit.dep) + ' deposit</span>' +
          '</div>' +

          '<div style="display:grid;grid-template-columns:repeat(2,1fr);gap:10px;margin-bottom:18px">' +
            '<div style="text-align:center;padding:10px;background:var(--bg-alt);border-radius:8px">' +
              '<p style="font-size:0.65rem;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.05em;margin-bottom:3px">Days 1\u201390</p>' +
              '<p style="font-weight:700;font-size:1.15rem;color:var(--green)">' + fmtKES(plan.d1) + '<span style="font-size:0.7rem;font-weight:400;color:var(--text-muted)">/day</span></p>' +
            '</div>' +
            '<div style="text-align:center;padding:10px;background:var(--bg-alt);border-radius:8px">' +
              '<p style="font-size:0.65rem;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.05em;margin-bottom:3px">Days 91\u2013540</p>' +
              '<p style="font-weight:700;font-size:1.15rem;color:var(--green)">' + fmtKES(plan.d2) + '<span style="font-size:0.7rem;font-weight:400;color:var(--text-muted)">/day</span></p>' +
            '</div>' +
          '</div>' +

          '<div style="margin-bottom:16px">' +
            '<p style="font-weight:600;font-size:0.75rem;color:var(--text-muted);margin-bottom:8px;text-transform:uppercase;letter-spacing:0.05em">Breakdown</p>' +
            '<div style="display:flex;gap:0;height:8px;border-radius:99px;overflow:hidden;margin-bottom:10px">' +
              '<div style="height:100%;width:' + dPct + '%;background:var(--green)"></div>' +
              '<div style="height:100%;width:' + p1Pct + '%;background:var(--green)"></div>' +
              '<div style="height:100%;width:' + p2Pct + '%;background:var(--text)"></div>' +
            '</div>' +
            '<div style="display:flex;justify-content:space-between;font-size:0.75rem">' +
              '<span><span style="display:inline-block;width:7px;height:7px;border-radius:99px;background:var(--green);margin-right:5px;vertical-align:middle"></span>Deposit <strong>' + fmtKES(activeDeposit.dep) + '</strong></span>' +
              '<span><span style="display:inline-block;width:7px;height:7px;border-radius:99px;background:var(--green);margin-right:5px;vertical-align:middle"></span>Days 1\u201390 <strong>' + fmtKES(phase1Total) + '</strong></span>' +
              '<span><span style="display:inline-block;width:7px;height:7px;border-radius:99px;background:var(--text);margin-right:5px;vertical-align:middle"></span>Days 91\u2013540 <strong>' + fmtKES(phase2Total) + '</strong></span>' +
            '</div>' +
          '</div>' +

          '<div style="border-top:2px solid var(--border);padding-top:12px;margin-bottom:16px">' +
            '<div style="display:flex;justify-content:space-between;align-items:baseline">' +
              '<span style="font-weight:700;font-size:1rem;color:var(--text)">Total repayment</span>' +
              '<span style="font-weight:700;font-size:1.15rem;color:var(--text)">' + fmtKES(total) + '</span>' +
            '</div>' +
          '</div>' +

          '<div style="background:var(--bg-alt);border-radius:10px;padding:14px;margin-bottom:16px">' +
            '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">' +
              '<span style="font-weight:600;font-size:0.8rem;color:var(--text)">Estimated daily surplus</span>' +
              '<span style="font-size:0.65rem;color:var(--text-muted)">based on KES 2,500 avg earnings</span>' +
            '</div>' +
            '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">' +
              '<div style="text-align:center;padding:8px;background:var(--card);border-radius:6px">' +
                '<p style="font-size:0.65rem;color:var(--text-muted);margin-bottom:1px">First 90 days</p>' +
                '<p style="font-weight:700;font-size:0.9rem;color:' + (surplus1 >= 0 ? 'var(--green)' : 'var(--text)') + '">+' + fmtKES(surplus1) + '<span style="font-size:0.65rem;font-weight:400;color:var(--text-muted)">/day</span></p>' +
              '</div>' +
              '<div style="text-align:center;padding:8px;background:var(--card);border-radius:6px">' +
                '<p style="font-size:0.65rem;color:var(--text-muted);margin-bottom:1px">After 90 days</p>' +
                '<p style="font-weight:700;font-size:0.9rem;color:' + (surplus2 >= 0 ? 'var(--green)' : 'var(--text)') + '">+' + fmtKES(surplus2) + '<span style="font-size:0.65rem;font-weight:400;color:var(--text-muted)">/day</span></p>' +
              '</div>' +
            '</div>' +
          '</div>' +

          '<a href="apply.html" class="btn" style="display:block;text-align:center;padding:12px">Apply for this plan \u2192</a>' +
        '</div>';

      resultsPanel.style.display = 'block';
      resultsPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  // ── Teaser calculator (index.html) ──────────────────────────────

  function initTeaser() {
    var container = document.getElementById('motoCalcTeaser');
    if (!container) return;

    var allDeposits = [];
    var seen = {};
    TIER_CONFIGS.forEach(function (tc) {
      tc.deposits.forEach(function (d) {
        if (!seen[d.dep]) { seen[d.dep] = true; allDeposits.push(d.dep); }
      });
    });
    allDeposits.sort(function (a, b) { return a - b; });

    container.innerHTML =
      '<section style="background:var(--bg-alt)">' +
        '<div class="card" style="max-width:700px;margin:0 auto;text-align:center">' +
          '<span class="section-label" style="text-align:center">Pricing</span>' +
          '<h2 style="text-align:center">What will your plan cost?</h2>' +
          '<p class="section-sub" style="text-align:center;margin:0 auto 1.5rem">Pick a deposit, see your daily rate \u2014 instantly.</p>' +

          '<div id="teaserPills" style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin-bottom:20px"></div>' +

          '<div id="teaserResult" style="display:none;padding:16px 0"></div>' +
        '</div>' +
      '</section>';

    var pillsContainer = document.getElementById('teaserPills');
    var resultContainer = document.getElementById('teaserResult');

    allDeposits.forEach(function (dep) {
      var pill = document.createElement('button');
      pill.setAttribute('type', 'button');
      pill.textContent = fmtKES(dep);
      pill.style.cssText =
        'padding:12px 24px;border:2px solid var(--border);background:var(--card);' +
        'border-radius:99px;font-weight:600;font-family:var(--font-body);' +
        'font-size:0.9rem;cursor:pointer;transition:all 0.2s ease;min-height:44px';
      pill.addEventListener('click', function () {
        document.querySelectorAll('#teaserPills button').forEach(function (b) {
          b.style.borderColor = 'var(--border)';
          b.style.background = 'var(--card)';
        });
        pill.style.borderColor = 'var(--green)';
        pill.style.background = '#e8f5ee';

        var spiro = BIKES[0];
        var best = null;
        var bestPlan = null;

        TIER_CONFIGS.forEach(function (tc) {
          tc.deposits.forEach(function (d) {
            if (d.dep === dep) {
              var plan = computePlan(spiro.cashPrice, d.dep, d.ratio, tc.markup);
              if (!best || plan.d2 < bestPlan.d2) {
                best = tc;
                bestPlan = plan;
              }
            }
          });
        });

        if (!best) return;

        resultContainer.style.display = 'block';
        resultContainer.innerHTML =
          '<div style="display:flex;align-items:center;justify-content:center;gap:16px;flex-wrap:wrap;margin-bottom:16px">' +
            '<span style="font-weight:600;color:var(--green)">' + best.name + '</span>' +
            '<span style="color:var(--text-muted)">|</span>' +
            '<span>' + fmtKES(bestPlan.d1) + '<span style="color:var(--text-muted);font-size:0.8rem">/day (first 90)</span></span>' +
            '<span style="color:var(--text-muted)">\u2192</span>' +
            '<span>' + fmtKES(bestPlan.d2) + '<span style="color:var(--text-muted);font-size:0.8rem">/day (after)</span></span>' +
          '</div>' +
          '<a href="pages/marketplace.html#calculator" class="btn" style="display:inline-block">See all plans \u2192</a>';
      });
      pillsContainer.appendChild(pill);
    });
  }

  // ── Init ─────────────────────────────────────────────────────

  document.addEventListener('DOMContentLoaded', function () {
    initFullCalculator();
    initTeaser();
  });

})();
