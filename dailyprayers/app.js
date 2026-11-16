/* Generated from discipleship/tools/daily-prayers/app.js. Edit that source, then run node discipleship/scripts/build_daily_prayers.js. */
(function () {
  'use strict';
  const DATA_KEY = 'lordsPrayerApp';
  const PRAYER_KEY = 'lordsPrayerApp_generated';
  const VIEW_KEY = 'dailyPrayersCompanionView';
  const PREVIOUS_KEY = 'dailyPrayersBeforeRestore';
  const FORMAT = 'ministrybag.daily-prayers';
  const ATTRIBUTES = ['Love', 'Joy', 'Peace', 'Patience', 'Kindness', 'Faith', 'Self-control', 'Hope', 'Wisdom', 'Healing', 'Strength', 'Protection', 'Forgiveness', 'Humility', 'Courage', 'Contentment'];
  const CHURCH = 'I pray for my church family. May we grow in our love for God and our neighbors. Help us be bold in sharing the Gospel, serve one another faithfully, and make disciples who make disciples. Continue to strengthen our leaders and may our church be a light in our community.';
  const LORDS_DISPLAY = 'Our Father, who is in heaven, holy is your name. Your kingdom come, your will be done on earth as it is in heaven. Give us this day our daily bread. Forgive us our sins, as we forgive those who sin against us. And lead us not into temptation, but deliver us from evil. For yours is the kingdom, and the power, and the glory forever. Amen.';
  const LORDS_EMAIL = "The Lord's Prayer\n\nOur Father, who is in heaven,\nHoly is your name,\nyour kingdom come, your will be done\non earth as it is in heaven.\nGive us this day, our daily bread.\nForgive us our sins, as we forgive those who sin against us.\nAnd lead us not into temptation, but deliver us from evil.\nFor yours is the kingdom, and the power, and the glory forever, Amen.";
  const $ = id => document.getElementById(id);
  const blankPerson = () => ({ name: '', selectedAttrs: [], customText: '' });
  const blankData = () => ({ personalAttrs: [], personalCustom: '', familyMembers: [], churchCustom: '', lostNames: [], lostCustom: '' });
  let model = blankData();
  let prayerText = '';
  let blocked = false;
  let loadFailed = false;
  let readUnavailable = false;
  let storageFailed = false;
  let lastRemoved = null;
  let pendingRestore = null;
  let importedFileName = '';

  function isObject(value) { return value !== null && typeof value === 'object' && !Array.isArray(value); }
  function normalize(value) {
    if (!isObject(value)) throw new Error('This copy does not contain a prayer list.');
    for (const key of ['personalCustom', 'churchCustom', 'lostCustom']) {
      if (value[key] !== undefined && typeof value[key] !== 'string') throw new Error('A prayer request in this copy could not be read.');
    }
    for (const key of ['personalAttrs', 'lostNames']) {
      if (value[key] !== undefined && (!Array.isArray(value[key]) || !value[key].every(v => typeof v === 'string'))) throw new Error('A name or growth area in this copy could not be read.');
    }
    if (value.familyMembers !== undefined && (!Array.isArray(value.familyMembers) || !value.familyMembers.every(p => isObject(p) && (p.name === undefined || typeof p.name === 'string') && (p.customText === undefined || typeof p.customText === 'string') && (p.selectedAttrs === undefined || (Array.isArray(p.selectedAttrs) && p.selectedAttrs.every(v => typeof v === 'string')))))) throw new Error('A person in this copy could not be read.');
    return { ...blankData(), ...value, personalAttrs: [...(value.personalAttrs || [])], lostNames: [...(value.lostNames || [])], familyMembers: (value.familyMembers || []).map(p => ({ ...blankPerson(), ...p, selectedAttrs: [...(p.selectedAttrs || [])] })) };
  }
  function formatAttributes(values) {
    const ordered = [...ATTRIBUTES.filter(a => values.includes(a)), ...values.filter(a => !ATTRIBUTES.includes(a))].map(a => a.toLowerCase());
    if (ordered.length < 2) return ordered[0] || '';
    if (ordered.length === 2) return ordered.join(' and ');
    return ordered.slice(0, -1).join(', ') + ', and ' + ordered[ordered.length - 1];
  }
  function compose(data) {
    let text = '';
    if (data.personalAttrs.length || data.personalCustom) {
      text += 'Create in me a clean heart, O God, and renew a right spirit within me.';
      if (data.personalAttrs.length) text += ' Help me grow in ' + formatAttributes(data.personalAttrs) + '.';
      if (data.personalCustom) text += ' ' + data.personalCustom;
      text += '\n\n';
    }
    for (const person of data.familyMembers) {
      if (!person.name) continue;
      text += person.selectedAttrs.length ? 'Lord, I pray that ' + person.name + ' will grow in ' + formatAttributes(person.selectedAttrs) + '.' : 'Lord, I pray that ' + person.name + ' will grow closer to You.';
      if (person.customText) text += ' ' + person.customText;
      text += '\n\n';
    }
    text += CHURCH;
    if (data.churchCustom) text += ' ' + data.churchCustom;
    text += '\n\n';
    const names = data.lostNames.filter(Boolean);
    if (names.length) {
      text += 'I pray for ' + names.join(' and ') + '...that they would know You. That they would repent of their sins, accept You as Savior and Lord, and love You above all. Use me today to be Your light in their lives.';
      if (data.lostCustom) text += ' ' + data.lostCustom;
      text += '\n\n';
    }
    return text + "In Jesus' name, Amen.";
  }
  function error(message) {
    $('save-error').textContent = message;
    $('save-error').hidden = !message;
    if (message) $('copy-tools').open = true;
  }
  function write(key, value) {
    try { localStorage.setItem(key, value); return true; }
    catch (_) {
      storageFailed = true;
      error('This browser could not save your latest changes. Keep this page open and use “Save a copy” below to keep them.');
      $('save-status').textContent = 'Your latest changes are open here, but have not been saved.';
      $('draft-status').textContent = 'Not saved. You can keep a copy below.';
      return false;
    }
  }
  function saved() {
    storageFailed = false;
    error('');
    $('draft-status').textContent = 'Draft saved in this browser.';
    $('save-status').textContent = 'Saved in this browser, on this device.';
  }
  function saveDraft() {
    if (blocked || readUnavailable) return false;
    if (write(DATA_KEY, JSON.stringify(model))) { saved(); return true; }
    return false;
  }
  function setView(view, focus) {
    $('read-view').hidden = view !== 'read';
    $('edit-view').hidden = view !== 'edit';
    try { localStorage.setItem(VIEW_KEY, view); } catch (_) { /* Data errors are reported by saveDraft, not a view preference. */ }
    if (focus) {
      $(view === 'read' ? 'read-heading' : 'edit-heading').focus({ preventScroll: true });
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }
  function renderRead() {
    $('prayer-content').textContent = prayerText;
    $('email-prayers').href = 'mailto:?subject=' + encodeURIComponent('My Prayer - ' + new Date().toLocaleDateString()) + '&body=' + encodeURIComponent(fullPrayer());
  }
  function fullPrayer() { return LORDS_EMAIL + '\n\n---\n\nMy Daily Prayers\n\n' + prayerText; }
  function attributeButtons(container, getValues, update) {
    container.replaceChildren();
    const values = getValues();
    const choices = [...ATTRIBUTES, ...values.filter(v => !ATTRIBUTES.includes(v))];
    for (const attr of [...new Set(choices)]) {
      const button = document.createElement('button');
      button.type = 'button'; button.className = 'attr-btn'; button.textContent = attr;
      button.setAttribute('aria-pressed', String(values.includes(attr)));
      button.addEventListener('click', () => {
        const current = getValues();
        update(current.includes(attr) ? current.filter(v => v !== attr) : [...current, attr]);
        button.setAttribute('aria-pressed', String(getValues().includes(attr)));
        saveDraft();
      });
      container.append(button);
    }
  }
  function label(text, input) {
    const node = document.createElement('label'); node.htmlFor = input.id; node.textContent = text; return node;
  }
  function familyAt(index) {
    if (!model.familyMembers[index]) model.familyMembers[index] = blankPerson();
    return model.familyMembers[index];
  }
  function renderFamily(focusIndex) {
    const container = $('family-members'); container.replaceChildren();
    const people = model.familyMembers.length ? model.familyMembers : [null];
    people.forEach((person, index) => {
      const value = person || blankPerson();
      const card = document.createElement('section'); card.className = 'person-card';
      const top = document.createElement('div'); top.className = 'person-top';
      const title = document.createElement('h3'); title.textContent = 'PERSON ' + String(index + 1).padStart(2, '0');
      top.append(title);
      if (person) {
        const remove = document.createElement('button'); remove.type = 'button'; remove.className = 'text-button remove-person'; remove.textContent = 'Remove person';
        remove.setAttribute('aria-label', 'Remove ' + (value.name || 'person ' + (index + 1)));
        remove.addEventListener('click', () => {
          lastRemoved = { type: 'family', index, value: model.familyMembers.splice(index, 1)[0] };
          saveDraft(); renderFamily(); showUndo(value.name || 'Person'); $('add-family').focus();
        }); top.append(remove);
      }
      const name = document.createElement('input'); name.type = 'text'; name.id = 'family-name-' + index; name.value = value.name; name.autocomplete = 'off';
      name.addEventListener('input', () => { familyAt(index).name = name.value; saveDraft(); });
      const attrs = document.createElement('div'); attrs.className = 'attribute-buttons'; attrs.setAttribute('role', 'group'); attrs.setAttribute('aria-label', 'Growth areas for person ' + (index + 1));
      attributeButtons(attrs, () => model.familyMembers[index]?.selectedAttrs || [], next => { familyAt(index).selectedAttrs = next; });
      const attrLabel = document.createElement('p'); attrLabel.className = 'attribute-label subtle'; attrLabel.textContent = 'Pray that this person will grow in:';
      const custom = document.createElement('textarea'); custom.id = 'family-request-' + index; custom.rows = 2; custom.value = value.customText;
      custom.addEventListener('input', () => { familyAt(index).customText = custom.value; saveDraft(); });
      card.append(top, label('Name', name), name, attrLabel, attrs, label('A specific prayer request (optional)', custom), custom); container.append(card);
    });
    if (focusIndex !== undefined) $('family-name-' + focusIndex)?.focus();
  }
  function renderPeople(focusIndex) {
    const container = $('people-names'); container.replaceChildren();
    const names = model.lostNames.length ? model.lostNames : [''];
    names.forEach((value, index) => {
      const row = document.createElement('div'); row.className = 'name-row';
      const field = document.createElement('div'); field.className = 'name-field';
      const input = document.createElement('input'); input.type = 'text'; input.id = 'person-name-' + index; input.value = value; input.autocomplete = 'off';
      input.addEventListener('input', () => { model.lostNames[index] = input.value; updatePeoplePreview(); saveDraft(); });
      field.append(label('Name', input), input); row.append(field);
      if (model.lostNames.length) {
        const remove = document.createElement('button'); remove.type = 'button'; remove.className = 'text-button remove-person'; remove.textContent = 'Remove'; remove.setAttribute('aria-label', 'Remove ' + (value || 'person ' + (index + 1)));
        remove.addEventListener('click', () => {
          lastRemoved = { type: 'people', index, value: model.lostNames.splice(index, 1)[0] };
          saveDraft(); renderPeople(); updatePeoplePreview(); showUndo(value || 'Person'); $('add-person').focus();
        }); row.append(remove);
      }
      container.append(row);
    });
    if (focusIndex !== undefined) $('person-name-' + focusIndex)?.focus();
  }
  function updatePeoplePreview() {
    const names = model.lostNames.map(n => n.trim()).filter(Boolean);
    $('people-preview').textContent = 'I pray for ' + (names.length ? names.join(' and ') : '[name]') + '...that they would know You. That they would repent of their sins, accept You as Savior and Lord, and love You above all. Use me today to be Your light in their lives.' + (model.lostCustom.trim() ? ' ' + model.lostCustom.trim() : '');
  }
  function showUndo(name) {
    $('undo-label').textContent = name + ' removed.'; $('undo-notice').hidden = false;
  }
  function renderEditor() {
    attributeButtons($('personal-attrs'), () => model.personalAttrs, values => { model.personalAttrs = values; });
    for (const id of ['personalCustom', 'churchCustom', 'lostCustom']) $(id).value = model[id];
    renderFamily(); renderPeople(); updatePeoplePreview();
  }
  function snapshot() { return { data: localStorage.getItem(DATA_KEY), generated: localStorage.getItem(PRAYER_KEY) }; }
  function normalBackup() {
    return { format: FORMAT, version: 1, savedAt: new Date().toISOString(), data: model, generatedPrayer: prayerText };
  }
  function download(value, name) {
    const url = URL.createObjectURL(new Blob([JSON.stringify(value, null, 2)], { type: 'application/json' }));
    const a = document.createElement('a'); a.href = url; a.download = name; document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  function downloadCurrent() {
    if (loadFailed) {
      try { download({ format: FORMAT + '.recovery', rawStores: snapshot() }, 'daily-prayers-recovery.json'); }
      catch (_) { $('backup-status').textContent = 'This browser could not read the saved copy. Your open prayers are still on this page.'; }
      return;
    }
    download(normalBackup(), 'daily-prayers-' + new Date().toISOString().slice(0, 10) + '.json');
    $('backup-status').textContent = 'Copy downloaded. Keep it somewhere you can find again.';
  }
  async function inspectBackup(file) {
    pendingRestore = null;
    if (!file) return;
    try {
      if (file.size > 5 * 1024 * 1024) throw new Error('Choose a prayer copy smaller than 5 MB.');
      const value = JSON.parse(await file.text());
      if (!isObject(value) || value.format !== FORMAT || value.version !== 1 || !isObject(value.data) || typeof value.generatedPrayer !== 'string') throw new Error('Choose a Daily Prayers copy saved with “Save a copy”.');
      pendingRestore = { data: normalize(value.data), generatedPrayer: value.generatedPrayer };
      importedFileName = file.name;
      const count = pendingRestore.data.familyMembers.filter(p => p.name).length + pendingRestore.data.lostNames.filter(Boolean).length;
      $('restore-description').textContent = file.name + ' contains ' + count + ' named ' + (count === 1 ? 'person' : 'people') + ' and your prayer requests.';
      $('restore-dialog').showModal();
    } catch (e) { $('backup-status').textContent = e instanceof SyntaxError ? 'This file could not be read. Choose a Daily Prayers JSON copy.' : e.message; }
    finally { $('backup-file').value = ''; }
  }
  function restoreBackup() {
    if (!pendingRestore) return;
    const candidate = pendingRestore; let previous;
    try {
      previous = snapshot();
      localStorage.setItem(PREVIOUS_KEY, JSON.stringify(previous));
      localStorage.setItem(DATA_KEY, JSON.stringify(candidate.data));
      localStorage.setItem(PRAYER_KEY, candidate.generatedPrayer);
    } catch (_) {
      if (previous) {
        try {
          for (const [key, value] of [[DATA_KEY, previous.data], [PRAYER_KEY, previous.generated]]) {
            if (value === null) localStorage.removeItem(key); else localStorage.setItem(key, value);
          }
        } catch (_) { /* The pre-restore copy remains available below. */ }
      }
      $('restore-dialog').close();
      $('backup-status').textContent = 'This browser could not finish the restore. Your previous copy is kept here; no changes were applied to your open prayer list.';
      refreshPreviousCopy(); return;
    }
    model = candidate.data; prayerText = candidate.generatedPrayer || compose(model); blocked = false; loadFailed = false; readUnavailable = false;
    $('prayer-form').inert = false; pendingRestore = null; lastRemoved = null; $('undo-notice').hidden = true;
    $('restore-dialog').close(); saved(); renderEditor(); renderRead(); setView('read', true); refreshPreviousCopy();
    $('app-message').textContent = 'Your prayers were restored from ' + importedFileName + '.'; $('app-message').hidden = false;
  }
  function refreshPreviousCopy() {
    try { $('download-previous').hidden = !localStorage.getItem(PREVIOUS_KEY); }
    catch (_) { $('download-previous').hidden = true; }
  }
  $('edit-prayers').addEventListener('click', () => { renderEditor(); setView('edit', true); });
  $('prayer-form').addEventListener('submit', event => {
    event.preventDefault(); if (blocked) return;
    prayerText = compose(model);
    if (saveDraft() && write(PRAYER_KEY, prayerText)) saved();
    renderRead(); setView('read', true);
  });
  for (const id of ['personalCustom', 'churchCustom', 'lostCustom']) $(id).addEventListener('input', () => { model[id] = $(id).value; if (id === 'lostCustom') updatePeoplePreview(); saveDraft(); });
  $('add-family').addEventListener('click', () => { if (!model.familyMembers.length) model.familyMembers.push(blankPerson()); model.familyMembers.push(blankPerson()); renderFamily(model.familyMembers.length - 1); saveDraft(); });
  $('add-person').addEventListener('click', () => { if (!model.lostNames.length) model.lostNames.push(''); model.lostNames.push(''); renderPeople(model.lostNames.length - 1); saveDraft(); });
  $('undo-remove').addEventListener('click', () => {
    if (!lastRemoved) return;
    const { type, index, value } = lastRemoved;
    if (type === 'family') model.familyMembers.splice(index, 0, value); else model.lostNames.splice(index, 0, value);
    lastRemoved = null; $('undo-notice').hidden = true; renderFamily(); renderPeople(); updatePeoplePreview(); saveDraft();
    $(type === 'family' ? 'family-name-' + index : 'person-name-' + index)?.focus();
  });
  $('copy-prayers').addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(fullPrayer()); $('copy-status').textContent = 'Copied.'; }
    catch (_) {
      const range = document.createRange(); range.selectNodeContents($('prayer-content')); const selection = window.getSelection(); selection.removeAllRanges(); selection.addRange(range);
      $('copy-status').textContent = 'Select and copy your prayers here.';
    }
  });
  $('print-prayers').addEventListener('click', () => window.print());
  $('download-copy').addEventListener('click', downloadCurrent);
  $('choose-copy').addEventListener('click', () => $('backup-file').click());
  $('backup-file').addEventListener('change', () => inspectBackup($('backup-file').files[0]));
  $('cancel-restore').addEventListener('click', () => { pendingRestore = null; $('restore-dialog').close(); });
  $('restore-dialog').addEventListener('cancel', () => { pendingRestore = null; });
  $('confirm-restore').addEventListener('click', restoreBackup);
  $('download-previous').addEventListener('click', () => {
    try {
      const previous = JSON.parse(localStorage.getItem(PREVIOUS_KEY));
      const data = previous.data === null ? blankData() : normalize(JSON.parse(previous.data));
      download({ format: FORMAT, version: 1, savedAt: new Date().toISOString(), data, generatedPrayer: previous.generated || '' }, 'daily-prayers-before-restore.json');
    } catch (_) {
      try { download({ format: FORMAT + '.recovery', rawStores: JSON.parse(localStorage.getItem(PREVIOUS_KEY)) }, 'daily-prayers-before-restore-recovery.json'); }
      catch (_) { $('backup-status').textContent = 'The previous copy could not be read.'; }
    }
  });

  function init() {
    $('lords-prayer').textContent = LORDS_DISPLAY;
    $('church-prayer').textContent = CHURCH;
    $('print-lords').textContent = LORDS_EMAIL;
    if (location.pathname.includes('/tools/daily-prayers/')) $('lesson-link').href = new URL('../../index.html#101-3', location.href).href;
    let raw = null, generated = null, view = null;
    try { raw = localStorage.getItem(DATA_KEY); generated = localStorage.getItem(PRAYER_KEY); view = localStorage.getItem(VIEW_KEY); }
    catch (_) {
      storageFailed = true; readUnavailable = true;
      error('This browser could not open saved prayers. You can still write and read here, and use “Save a copy” to keep your prayers.');
      $('save-status').textContent = 'Browser saving is unavailable. Keep a copy before leaving.';
      $('draft-status').textContent = 'Browser saving is unavailable. Keep a copy.';
    }
    if (raw !== null) {
      try { model = normalize(JSON.parse(raw)); }
      catch (_) {
        blocked = true; loadFailed = true;
        error('Your saved prayer list could not be opened. Nothing has been replaced. Use “Save a copy” to keep the original, or restore a copy you saved earlier.');
        $('prayer-form').inert = true;
      }
    }
    prayerText = generated || ((!blocked && raw !== null) ? compose(model) : '');
    renderEditor(); renderRead(); refreshPreviousCopy();
    $('boot').hidden = true;
    const initialView = blocked ? (prayerText ? 'read' : 'edit') : (view === 'edit' || !prayerText ? 'edit' : 'read');
    // Loading old data does not rewrite either legacy store.
    $('read-view').hidden = initialView !== 'read'; $('edit-view').hidden = initialView !== 'edit';
    if (!raw && !generated && !storageFailed) $('save-status').textContent = 'Your prayers will save in this browser, on this device.';
  }
  init();
})();
