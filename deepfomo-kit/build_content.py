#!/usr/bin/env python3
"""content.md -> content.js

输入 markdown 约定：
- 顶部 YAML 风格 front matter（question / chips / danmaku / ending / end_placeholder / greeting / rate）
- `## 思考` 节：每个列表项一行思考，`==高亮==` 标记加亮短语
- `## 回答` 节：正文段落；`### 标题` 为分节小标题；`**加粗**` 为重点句（渲染为加粗+金色下划线）；
  markdown 表格原样渲染；`> 段落` 为结尾 meta 段（灰色小字）
"""
import json, re, sys

def parse_front(lines):
    meta, i = {}, 0
    assert lines[0].strip() == '---', 'content.md 必须以 --- front matter 开头'
    i = 1
    while lines[i].strip() != '---':
        k, v = lines[i].split(':', 1)
        v = v.strip()
        if v.startswith('['):
            v = [x.strip().strip('"').strip("'") for x in v.strip('[]').split('、')] \
                if '、' in v else [x.strip().strip('"').strip("'") for x in v.strip('[]').split(',')]
        meta[k.strip()] = v
        i += 1
    return meta, i + 1

def segs_hl(text):
    """==x== -> {t,hl:1}"""
    out = []
    for part in re.split(r'(==[^=]+==)', text):
        if not part: continue
        if part.startswith('==') and part.endswith('=='):
            out.append({'t': part[2:-2], 'hl': 1})
        else:
            out.append({'t': part})
    return out

def segs_bold(text):
    """**x** -> {t,b:1}"""
    out = []
    for part in re.split(r'(\*\*.+?\*\*)', text):
        if not part: continue
        if part.startswith('**') and part.endswith('**'):
            out.append({'t': part[2:-2], 'b': 1})
        else:
            out.append({'t': part})
    return out

def parse_table(block):
    rows = [[c.strip() for c in ln.strip().strip('|').split('|')] for ln in block]
    head = rows[0]
    body = [r for r in rows[2:]]  # skip separator
    return {'head': head, 'rows': body}

def main():
    src = sys.argv[1] if len(sys.argv) > 1 else 'content.md'
    dst = sys.argv[2] if len(sys.argv) > 2 else 'content.js'
    lines = open(src, encoding='utf-8').read().splitlines()
    meta, i = parse_front(lines)

    think, answer, section = [], [], None
    buf_table = []
    def flush_table():
        nonlocal buf_table
        if buf_table:
            answer.append({'table': parse_table(buf_table)})
            buf_table = []

    for ln in lines[i:]:
        s = ln.rstrip()
        if s.startswith('## '):
            flush_table()
            section = s[3:].strip()
            continue
        if not s.strip():
            flush_table()
            continue
        if section == '思考':
            if s.lstrip().startswith('- '):
                think.append(segs_hl(s.lstrip()[2:]))
        elif section == '回答':
            if s.lstrip().startswith('|'):
                buf_table.append(s)
                continue
            flush_table()
            if s.startswith('### '):
                answer.append({'cls': 'h', 'segs': [{'t': s[4:].strip()}]})
            elif s.startswith('> '):
                answer.append({'cls': 'meta', 'segs': segs_bold(s[2:])})
            else:
                answer.append({'segs': segs_bold(s)})
    flush_table()

    content = {
        'question': meta['question'],
        'think': think,
        'answer': answer,
    }
    for k in ('chips', 'danmaku', 'ending', 'greeting'):
        if k in meta: content[k] = meta[k]
    if 'end_placeholder' in meta: content['end_placeholder'] = meta['end_placeholder']
    if 'rate' in meta: content['rate'] = float(meta['rate'])

    with open(dst, 'w', encoding='utf-8') as f:
        f.write('window.CONTENT = ' + json.dumps(content, ensure_ascii=False, indent=1) + ';\n')
    print(f'{dst}: think={len(think)} lines, answer={len(answer)} blocks')

if __name__ == '__main__':
    main()
