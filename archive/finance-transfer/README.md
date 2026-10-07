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
| `perspective-export-redaction.patch` | PR 5：画像脱敏导出（分享框架不分享来源） |
| `river-all-five.patch` | 上面五个的合集，一次 `git am` 全上 |

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
git am < /path/to/river-all-five.patch
```

装好之后可以直接跑这条，看你自己的视角河能接住几条：

```bash
python3 scripts/audit_perspective_consumability.py --perspective kol_fengyuan
python3 scripts/audit_perspective_consumability.py --perspective sptfei --user linxiaoqi5111 --list-criteria
```

五个补丁都已在**干净的 `main` clone** 上验过 `git am` + 实跑测试
（最后一次：五个按序 am 后 `82 passed`，并在该 clone 上跑通了视角审计）。

## ⚠ 关于私有画像

`moscrol/finance` 是**公开仓**（实测 `private: false`）。
`intelligence/users/*/perspectives/` 被 `.gitignore:114` 排除，理由是版权 + 隐私。
**不要把它推上去。** 要分享框架请用 PR 5 的脱敏导出：

```bash
python3 scripts/export_perspective_framework.py --perspective sptfei --user <你的用户名>
```

它只导 market_lenses / risk_triggers / reasoning_patterns / falsification_style 等
可迁移结构，白名单之外一律丢弃并点名。

## 合并前必做

本次所有读数都是在 **Python 3.11 + `FWP_ALLOW_ANY_PYTHON=1`** 下取的，不是契约规定的
3.12.13 `.venv-workbench`（那个 venv 不在版本库里，干净 clone 中不存在）。
合并前要在正确解释器上复跑一次。每个补丁自带的 `docs/verification/*.md` 收据里已写明这一条。

---

## 2026-10-07 第二批：搭桥 / 拆画像 / 口径（用户已授权三项）

**基线不同**：这三个补丁基于 `docs/cloud-research-context` 分支（PR #71，`148a09ec`），
不是前五个补丁的 `main` 基线。两批互不依赖，可分别应用。

| 补丁 | 内容 |
|---|---|
| `teaching-bridge.patch` | **P1 搭桥**。47 个 `tf.*` 教学标签中落到河上的 16 个，开放 14 个给判定路径，命名空间不合并。缺旁路库 → Kleene `unknown`，不是 false 也不是静默跳过 |
| `profile-lens-split.patch` | **P2 拆 SPT**。`量能状态机`(1856字/52条) + `筹码与结构`(1037字/34条) → 86 条带稳定 ID 的条目，逐字可还原，1 条待用户裁定 |
| `profile-boundary-scope.patch` | **P3 口径**。按调用方身份分三档，**本人自用档不设个股限制**（用户 10-07 第二次裁定）；对外产品档红线保留且只限个股层面。改为结构化 `output_policy` 字段，三处散文指向它 |
| `teaching-cycle-labels.patch` | **搬运**。旁路库算了却从未上河的 9 个周期位置标签 → `teaching_cycle` 对象并开放判定。只搬不算,不新增任何计算或阈值。**用户框架概念可判定 5 → 20 / 21** |
| `spt-007-adjudication.patch` | 裁定 `sptfei.筹码与结构.007`「临近突破状态」为独立条目,并挂 `definitional_gap`(9 次引用 0 次定义) |
| `bridge-split-boundary-all-three.patch` | 上面五个的一把梭 |

候选产物（不写回生产画像，供本机应用）：
- `2026-10-07-sptfei-lens-split-candidate.json` —— SPT 86 条拆分结果
- `2026-10-07-strategy-scope-candidate.json` —— 口径三处差异 + 来源记录 ID

**验证**：干净 clone `git am` 五连成功 → 新测 **37 passed**，相关回归 **510 passed / 2 skipped**，ruff 干净。
`git push` 到 finance 仍 403（与前五个补丁同因），故走补丁交付。

⚠ 两个候选 JSON 里含画像内容，但均来自用户已授权公开的 PR #71 快照，不含新的私有信息。
