export const ensureMessageBox = (root) => {
  let box = root.querySelector('[data-msgbox="1"]');
  if (box) return box;

  box = document.createElement('div');
  box.dataset.msgbox = '1';
  box.style.margin = '10px 4px 0';
  box.style.padding = '12px 14px';
  box.style.borderRadius = '16px';
  box.style.fontWeight = '800';
  box.style.border = '1px solid rgba(0,0,0,.08)';
  box.style.display = 'none';

  root.insertBefore(box, root.querySelector('.group') || root.firstChild);
  return box;
};

export const showMessage = (box, text, kind = 'info') => {
  box.textContent = text;
  box.style.display = 'block';

  if (kind === 'ok') {
    box.style.background = '#EAF9E3';
    box.style.color = '#256B1B';
  } else if (kind === 'warn') {
    box.style.background = '#FFF4D6';
    box.style.color = '#7A4B00';
  } else if (kind === 'danger') {
    box.style.background = '#FFE3E3';
    box.style.color = '#7A0000';
  } else {
    box.style.background = '#EEF7FF';
    box.style.color = '#0A3A66';
  }
};

export const hideMessage = (box) => {
  box.style.display = 'none';
  box.textContent = '';
};

export const setProgress = (percent) => {
  const bar = document.querySelector('.progress__bar');
  const progress = document.querySelector('.progress');
  if (!bar || !progress) return;
  const p = Math.max(0, Math.min(100, percent));
  bar.style.width = `${p}%`;
  progress.setAttribute('aria-valuenow', String(p));
};
