(function () {
  'use strict';

  var currentType = 'refugee';
  var currentStep = 1;

  var tabs = document.querySelectorAll('.apply-tab');
  var typeFields = document.querySelectorAll('.step-type-fields');
  var steps = document.querySelectorAll('.apply-step');
  var dots = document.querySelectorAll('.apply-progress .dot');
  var labels = document.querySelectorAll('.progress-step-labels span');
  var form = document.getElementById('applyForm');
  var success = document.getElementById('applySuccess');

  /* ── TAB SWITCHING ── */
  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      var type = tab.getAttribute('data-type');
      if (type === currentType) return;
      currentType = type;
      tabs.forEach(function (t) { t.classList.remove('active'); });
      tab.classList.add('active');

      typeFields.forEach(function (f) {
        f.style.display = f.getAttribute('data-for') === type ? '' : 'none';
      });

      goStep(1);
    });
  });

  /* ── CHOICE PILLS (radio / checkbox) ── */
  document.querySelectorAll('.choice-pills').forEach(function (group) {
    group.addEventListener('change', function () {
      var pills = group.querySelectorAll('.choice-pill');
      var isCheckbox = group.querySelector('input[type="checkbox"]');

      pills.forEach(function (pill) {
        var input = pill.querySelector('input');
        if (isCheckbox) {
          pill.classList.toggle('selected', input.checked);
        } else {
          pill.classList.toggle('selected', input.checked);
        }
      });
    });
  });

  // Init: mark initial radio selections
  document.querySelectorAll('.choice-pills input:checked').forEach(function (inp) {
    inp.closest('.choice-pill').classList.add('selected');
  });

  /* ── BIKE SELECTION ── */
  var bikeCards = document.querySelectorAll('.bike-card');
  bikeCards.forEach(function (card) {
    card.addEventListener('click', function () {
      bikeCards.forEach(function (c) { c.classList.remove('selected'); });
      card.classList.add('selected');
    });
  });

  /* ── STEP NAVIGATION ── */
  window.goStep = function (n) {
    if (!validateStep(currentStep) && n > currentStep) return;
    currentStep = n;
    renderStep();
  };

  function renderStep() {
    steps.forEach(function (s) {
      s.classList.toggle('active', parseInt(s.getAttribute('data-step'), 10) === currentStep);
    });
    dots.forEach(function (d) {
      var dn = parseInt(d.getAttribute('data-step'), 10);
      d.classList.toggle('active', dn === currentStep);
      d.classList.toggle('done', dn < currentStep);
      d.textContent = dn < currentStep ? '✓' : dn;
    });
    var bars = document.querySelectorAll('.apply-progress-bar .fill');
    bars.forEach(function (b, i) {
      b.style.width = currentStep > i + 1 ? '100%' : '0%';
    });
    labels.forEach(function (l, i) {
      l.classList.toggle('active-label', i + 1 === currentStep);
    });
    window.scrollTo({ top: form.offsetTop - 100, behavior: 'smooth' });
  }

  /* ── VALIDATION ── */
  function validateStep(step) {
    if (step === 3) return true;
    var stepEl = document.querySelector('.apply-step[data-step="' + step + '"]');
    if (!stepEl) return true;
    var required = stepEl.querySelectorAll('[required]');
    var valid = true;

    required.forEach(function (field) {
      field.style.borderColor = '';
      if (!field.value || field.value.trim() === '' || field.value === 'Select...' || field.value === 'Select county...') {
        field.style.borderColor = '#c0392b';
        valid = false;
      }
    });

    if (step === 1) {
      // Type-specific required fields
      var typeFieldsContainer = stepEl.querySelector('.step-type-fields[data-for="' + currentType + '"]');
      if (typeFieldsContainer) {
        var typeReq = typeFieldsContainer.querySelectorAll('[required]');
        typeReq.forEach(function (field) {
          field.style.borderColor = '';
          if (!field.value || field.value.trim() === '' || field.value === 'Select...') {
            field.style.borderColor = '#c0392b';
            valid = false;
          }
        });
      }
    }

    if (step === 2) {
      var pills = stepEl.querySelectorAll('.choice-pills');
      pills.forEach(function (group) {
        var checked = group.querySelector('input:checked');
        if (!checked) {
          var firstPill = group.querySelector('.choice-pill');
          if (firstPill) firstPill.style.borderColor = '#c0392b';
          valid = false;
        } else {
          group.querySelectorAll('.choice-pill').forEach(function (p) { p.style.borderColor = ''; });
        }
      });
    }

    if (!valid) {
      var firstErr = stepEl.querySelector('[style*="border-color: rgb(192, 57, 43)"]');
      if (firstErr) firstErr.focus({ preventScroll: true });
    }

    return valid;
  }

  /* ── SUBMIT ── */
  window.submitForm = function () {
    if (!validateStep(3)) return;

    // Check bike selected
    var selected = document.querySelector('.bike-card.selected');
    if (!selected) {
      bikeCards[0].style.borderColor = '#c0392b';
      bikeCards[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(function () { bikeCards[0].style.borderColor = ''; }, 2000);
      return;
    }

    var data = {};
    var fd = new FormData(form);
    fd.forEach(function (v, k) {
      if (data[k]) {
        if (!Array.isArray(data[k])) data[k] = [data[k]];
        data[k].push(v);
      } else {
        data[k] = v;
      }
    });
    data.applicantType = currentType;
    data.selectedBike = selected.getAttribute('data-bike');

    var btn = document.querySelector('.apply-submit');
    btn.disabled = true;
    btn.textContent = 'Submitting...';

    var apiBase = window.API_URL || 'http://localhost:3000';
    var xhr = new XMLHttpRequest();
    xhr.open('POST', apiBase + '/api/applications', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function () {
      btn.disabled = false;
      btn.textContent = 'Submit Application';
      if (xhr.status >= 200 && xhr.status < 300) {
        form.style.display = 'none';
        success.classList.add('show');
        success.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        var err = JSON.parse(xhr.responseText);
        alert('Error: ' + (err.error || 'Submission failed. Please try again.'));
      }
    };
    xhr.onerror = function () {
      btn.disabled = false;
      btn.textContent = 'Submit Application';
      alert('Network error. Please check your connection and try again.');
    };
    xhr.send(JSON.stringify(data));
  };

  /* ── ENTER KEY ── */
  form.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (currentStep < 3) window.goStep(currentStep + 1);
      else window.submitForm();
    }
  });

  /* ── FAQ ACCORDION (global for onclick) ── */
  window.toggleFaq = function (el) {
    el.classList.toggle('open');
    var answer = el.nextElementSibling;
    if (answer) answer.classList.toggle('open');
  };

})();
