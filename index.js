/* Enable/disable 連結功能 */

function handleCheckBoxChange() {
  document.getElementById('checkBox').checked ? document.body.classList.remove('link-disabled') : document.body.classList.add('link-disabled');
}

handleCheckBoxChange();

/* Enable/disable 文字選擇功能 */

function handleCheckBox2Change() {
  document.getElementById('checkBox2').checked ? document.body.classList.remove('user-unselectable') : document.body.classList.add('user-unselectable');
}

handleCheckBox2Change();

/* Add table of contents */

((() => {
  const fragment = document.createDocumentFragment();

  [...document.getElementsByTagName('table')].forEach((table, i) => {
    table.id = 't' + (i + 1);

    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = '#t' + (i + 1);
    a.innerText = table.querySelector('thead th').textContent + '：' + [...table.querySelectorAll('tbody tr:last-child th + th')].map((th) => th.textContent).filter(Boolean).join('、');
    li.appendChild(a);
    fragment.appendChild(li);
  });

  const toc = document.getElementById('TOC');
  toc.appendChild(fragment);
})());

/* Copy 平 to 上去入 */

document.querySelectorAll('table:not(.no-generate) tbody tr').forEach((tr) => {
  const fragment = document.createDocumentFragment();
  for (const 聲調 of '上去入') {
    [...tr.getElementsByTagName('td')].forEach((td) => {
      const new_td = document.createElement('td');
      new_td.innerText = td.textContent.replace('平', 聲調);
      fragment.appendChild(new_td);
    });
  }
  tr.appendChild(fragment);
});

/* Add spaces to title */

[...document.querySelectorAll('tbody tr:not(:last-child) th:last-of-type')].forEach((th) => {
  if (th.textContent.length > 1) {
    th.innerText = [...th.textContent].join(' ');
  }
});

/* Convert 音韻地位 to 代表字 and add tooltip */

document.querySelectorAll('tbody td').forEach((td) => {
  const 描述 = td.textContent.trim();

  if (描述.length === 0) { // empty 音韻地位
    td.innerText = '';
    td.classList.add('empty-position');
  } else {
    const 音韻地位 = Qieyun.音韻地位.from描述(描述);
    if (音韻地位.屬於('支脂之微魚虞模韻 入聲')) {
      td.innerText = '';
      td.classList.add('empty-position');
    } else {
      const 代表字 = 音韻地位.代表字;

      let 提示;
      if (代表字 == null) {
        td.innerText = '';
        提示 = '無 字';
      } else {
        const 小韻號 = sieuxyonh[音韻地位.編碼];
        if (小韻號) {
          const a = document.createElement('a');
          a.innerText = 代表字;
          a.href = `https://ytenx.org/kyonh/sieux/${小韻號}/`;
          a.target = '_blank';
          td.innerText = '';
          td.appendChild(a);
        } else {
          td.innerText = 代表字;
        }
        const 反切 = 音韻地位.反切(代表字);
        提示 = [...(反切 == null ? '' : 反切 + '切')].join(' ');
      }

      tippy(td, {
        content: [...描述].join(' ') + '<br>' + 提示,
        allowHTML: true,
        placement: 'right',
      });
    }
  }
});
