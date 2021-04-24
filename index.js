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

  [...document.getElementsByTagName('h2')].forEach((h2) => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = 'javascript:void(0)';
    a.onclick = () => h2.scrollIntoView();
    a.innerText = h2.textContent;
    li.appendChild(a);
    fragment.appendChild(li);
  });

  const toc = document.getElementById('TOC');
  toc.appendChild(fragment);
})());

/* Add tables */

const 類型到母 = {
  '一'  : '幫滂並明端透定泥見溪　疑精清從心　影曉匣　來　',
  '二'  : '幫滂並明知徹澄孃見溪　疑莊初崇生　影曉匣　來　',
  '假二': '　　　　　　　　　　　　莊初崇生俟　　　　　　',
  '三'  : '幫滂並明知徹澄孃見溪羣疑章昌船書常影曉　云來日',
  '假四': '幫滂並明　　　　見溪羣疑精清從心邪影曉　以　　',
  '四'  : '幫滂並明端透定泥見溪　疑精清從心　影曉匣　來　',
};

const 開合皆有的韻 = '支脂微齊祭泰佳皆夬廢眞元寒刪山仙先歌麻陽唐庚耕清青蒸登';

const 重紐母 = '幫滂並明見溪羣疑影曉';
const 重紐韻 = '支脂祭眞仙宵清侵鹽';

const fragments = [...document.getElementsByClassName('template-data')];

for (const fragment of fragments) {
  const data = JSON.parse(fragment.innerHTML);
  const table = document.getElementById('template-table').content.cloneNode(true).childNodes[0];
  const trs = table.querySelectorAll('tr');
  for (let i = 0; i < 23; i++) {
    const tr = trs[i];
    for (let j = 0; j < 16; j++) {
      const td = document.createElement('td');
      const 韻類型聲 = data[j];
      if (韻類型聲 == null) {
        td.classList.add('empty-position');
      } else {
        const [韻, 類型, 聲, 開合1] = 韻類型聲;
        const 母 = 類型到母[類型][i];
        const 開合 = [...'幫滂並明'].includes(母) ? null : (開合1 || null);
        const 重紐 = (![...重紐母].includes(母) || ![...重紐韻].includes(韻)) ? null : 類型 === '三' ? 'B' : 'A';
        const 等 = {
          '一': '一',
          '二': '二',
          '三': '三',
          '四': '四',
          '假二': '三',
          '假四': '三',
        }[類型];
        if ( 母 === '　'
          || [...開合皆有的韻].includes(韻) && [...'幫滂並明'].includes(母) && 開合1 === '合'
          || 類型 == '假四' && ![...重紐韻].includes(韻) && [...重紐母].includes(母)
        ) {
          td.classList.add('empty-position');
        } else {
          const 音韻地位 = new Qieyun.音韻地位(母, 開合, 等, 重紐, 韻, 聲);

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
            content: [...音韻地位.描述].join(' ') + '<br>' + 提示,
            allowHTML: true,
            placement: 'right',
          });
        }
      }
      tr.appendChild(td);
    }
  }

  const tr = trs[23];
  for (let j = 0; j < 16; j++) {
    const th = document.createElement('th');
    const 韻類型聲 = data[j];
    if (韻類型聲 == null) {
      //
    } else {
      const [韻, 類型, 聲, 開合1] = 韻類型聲;
      th.innerText = yonh[韻 + 聲];

      tippy(th, {
        content: [...(類型[0] === '假' ? '三等' + 類型 : 類型)].join(' ') + ' 等',
        allowHTML: true,
        placement: 'right',
      });
    }
    tr.appendChild(th);
  }

  document.body.replaceChild(table, fragment);
}
