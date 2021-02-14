/* Add table of contents */

((() => {
  const fragment = document.createDocumentFragment();

  [...document.getElementsByTagName('h2')].forEach((h2, i) => {
    h2.id = 't' + (i + 1);

    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = '#t' + (i + 1);
    a.innerText = h2.textContent;
    li.appendChild(a);
    fragment.appendChild(li);
  });

  const toc = document.getElementById('TOC');
  toc.appendChild(fragment);
})());

/* Copy 平 to 上去入 */

[...document.getElementsByTagName('tr')].forEach((tr) => {
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

[...document.querySelectorAll('tr th:last-of-type')].forEach((th) => {
  if (th.textContent.length > 1) {
    th.innerText = [...th.textContent].join(' ');
  }
});

/* Convert 音韻地位 to 代表字 and add tooltip */

[...document.getElementsByTagName('td')].forEach((td) => {
  const 描述 = td.textContent;

  if (描述.length === 0 || 描述.indexOf(' ') !== -1) { // empty 音韻地位
    td.innerText = '';
    td.classList.add('empty-position')
  } else {
    const 音韻地位 = Qieyun.音韻地位.from描述(描述);
    const 代表字 = 音韻地位.代表字;

    let 提示;
    if (代表字 == null) {
      td.innerText = '';
      提示 = '無 字';
    } else {
      td.innerText = 代表字;
      const 反切 = 音韻地位.反切(代表字);
      提示 = [...(反切 == null ? '' : 反切 + '切')].join(' ');
    }

    tippy(td, {
      content: [...描述].join(' ') + '<br>' + 提示,
      allowHTML: true,
      placement: 'right',
    });
  }
});
