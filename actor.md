## 角色信息

### 角色分类

- 玩家 ActorHero
- NPC ActorNPC
- 怪物(包括人形敌人) ActorMonster
- 盟友(雇佣兵) ActorAlly
- 宠物 ActorPet

怪物会主动攻击玩家和盟友

玩家和盟友会主动攻击怪物

玩家可以攻击NPC，但是会有惩罚（例如罚金或者道德值降低）

宠物不能被任何人攻击，宠物没有碰撞检测，遇到怪物会逃跑


### 角色职业

角色没有职业划分，但是有头衔

### 角色头衔

角色

### 角色技能

技能包括战斗技能和生活技能，统称技能

##### 战斗技能

一级技能：
- 近战：　肉搏，刀剑，枪
- 远程：　弓箭，魔法

二级技能：
二级技能是一级技能的子类，例如肉搏类，可以有穿心掌，刀剑类可以有二刀流，魔法类可以有火球术，闪电术等

##### 生活技能

预计有：
- 烹饪
- 口才
- 种植
- 等等


### 角色属性

角色一级属性：

- 力量 strength str
- 敏捷 dexterity dex
- 耐力 constitution con
- 智力 intelligence int
- 魅力 charisma cha


二级属性：

- 攻击力 atk
- 防御力 def
- 魔法攻击 matk
- 魔法防御 mdef
- 生命值 hp
- 精神值 sp
- 暴击率 critical
- 闪避率 dodge


### 公式

伤害公式：

普通伤害 = attacker.atk + attacker.skill.power - enemy.def
魔法伤害 = attacker.matk + attacker.skill.power - enemy.mdef

其中skill.power是攻击者所使用攻击技能的伤害
