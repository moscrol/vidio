# finance 仓中转目录

这里放的是在 `moscrol/finance` 上做的工作。放在 vidio 是因为本次会话的 GitHub 凭据
只授权了 `vidio` 一个仓，推 `moscrol/finance` 返回 403。文件在这里只是**过境**，
迁走之后这个目录可以直接删掉。

## 内容

| 文件 | 说明 |
|---|---|
| `时间长河机制-质检报告.md` | 对 finance 仓「时间记忆长河机制」的质检报告（对照设计意图，区分已落地 / 骨架 / 愿望） |
| `river-ci-contract-coverage.patch` | PR 1：让河的契约在 CI 上真的跑起来 + `derive_streak` 类型门 |
| `river-label-binding-expansion.patch` | PR 2：把已注册但未绑定的标签接进切片，可判标签 4 → 7 |
| `river-text-domain-gate.patch` | PR 3：文本谓词检查取值域（由 agent 消费实验挖出） |
| `perspective-river-map.patch` | PR 4：视角↔河 映射表 + 可消费性审计工具 |
| `river-all-four.patch` | 上面四个的合集，一次 `git am` 全上 |

## 迁移方式

```bash
cd ~/你的finance
git checkout main && git pull

# PR 1
git checkout -b fix/river-ci-contract-coverage
git am < /path/to/river-ci-contract-coverage.patch
git push -u origin fix/river-ci-contract-coverage && gh pr create

# PR 2（基于 PR 1；它的测试用到 PR 1 引入的夹具库）
git checkout -b feat/river-label-binding-expansion
git am < /path/to/river-label-binding-expansion.patch
git push -u origin feat/river-label-binding-expansion && gh pr create

# PR 3（基于 PR 2）
git checkout -b feat/river-text-domain-gate
git am < /path/to/river-text-domain-gate.patch
git push -u origin feat/river-text-domain-gate && gh pr create
```

# PR 4（基于 PR 3）
git checkout -b feat/perspective-river-map
git am < /path/to/perspective-river-map.patch
git push -u origin feat/perspective-river-map && gh pr create
```

或者一把梭（四个 commit 一个分支）：

```bash
git checkout -b feat/river-consumability
git am < /path/to/river-all-four.patch
```

装好之后可以直接跑这条，看你自己的视角河能接住几条：

```bash
python3 scripts/audit_perspective_consumability.py --perspective kol_fengyuan
python3 scripts/audit_perspective_consumability.py --perspective sptfei --user linxiaoqi5111 --list-criteria
```

四个补丁都已在**干净的 `main` clone** 上验过 `git am` + 实跑测试
（最后一次：四个按序 am 后 `75 passed`，并在该 clone 上跑通了视角审计）。

## 合并前必做

本次所有读数都是在 **Python 3.11 + `FWP_ALLOW_ANY_PYTHON=1`** 下取的，不是契约规定的
3.12.13 `.venv-workbench`（那个 venv 不在版本库里，干净 clone 中不存在）。
合并前要在正确解释器上复跑一次。每个补丁自带的 `docs/verification/*.md` 收据里已写明这一条。
