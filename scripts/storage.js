export const options = {};
export const tmp = {};
export const optionsForm = {};

/**
 * 非同期ストレージ管理オブジェクト
 * chrome.storage.local を利用してデータを保存・取得する
 */
export var a_storage = {
  /**
   * オブジェクトが空かどうかを確認
   */
  isEmpty: async function (obj) {
    return !Object.keys(obj).length;
  },

  /**
   * プレフィックスを追加
   */
  prefix: async function (prefix, name) {
    return prefix ? `${prefix}-${name}` : name;
  },

  /**
   * ストレージにキーを作成
   */
  create: async function (table, prefix) {
    table = await this.prefix(prefix, table);
    console.log(`create key: ${table}`);
    try {
      const data = await chrome.storage.local.get(table);
      if (typeof data !== 'object') return;
      let val = data[table] || {};
      console.log(data, val, typeof val);
      if (await this.isEmpty(val)) return this.reset(table, val);
    } catch (e) {
      console.error(`Error: ${e}`);
    }
  },

  /**
   * ストレージをリセット
   */
  reset: async function (table, data, prefix) {
    table = await this.prefix(prefix, table);
    console.log(`reset key: ${table}`);
    return chrome.storage.local.set({ [table]: JSON.stringify(data) });
  },

  /**
   * 指定したキーを削除
   */
  clear: async function (table, prefix) {
    table = await this.prefix(prefix, table);
    console.log(`Clearing: ${table}`);
    return chrome.storage.local.remove(table);
  },

  /**
   * プレフィックスがついたキーをすべて削除
   */
  clearPrefixed: async function (prefix, skipList = []) {
    const all = await chrome.storage.local.get();
    for (const [name] of Object.entries(all)) {
      let id = name.startsWith(prefix) ? name.replace(`${prefix}-`, '') : name;
      if (name.includes(prefix) && !skipList.includes(id)) {
        this.clear(name);
      }
    }
  },

  /**
   * データを挿入
   */
  insert: async function (table, id, itemData, prefix) {
    table = await this.prefix(prefix, table);
    const data = await this.select(table);
    data[id] = itemData;
    this.reset(table, data);
  },

  /**
   * データを更新
   */
  update: async function (table, id, itemData, prefix) {
    try {
      table = await this.prefix(prefix, table);
      const data = await this.select(table);
      data[id] = itemData;
      await this.reset(table, data);
    } catch (e) {
      console.error(`Error: ${e}`);
    }
  },

  /**
   * データを削除
   */
  remove: async function (table, id, prefix) {
    table = await this.prefix(prefix, table);
    const data = await this.select(table);
    if (data[id] !== undefined) {
      delete data[id];
      this.reset(table, data);
      return true;
    }
    return false;
  },

  /**
   * 指定した ID が存在するかチェック
   */
  hasId: async function (table, id, prefix) {
    table = await this.prefix(prefix, table);
    const data = await this.select(table);
    return data[id] !== undefined;
  },

  /**
   * データを取得
   */
  select: async function (table, prefix) {
    table = await this.prefix(prefix, table);
    const data = await chrome.storage.local.get(table);
    return data[table] ? JSON.parse(data[table]) : {};
  },
};

/**
 * ローカルストレージ管理オブジェクト
 */
export var storage = {
  /**
   * データを保存
   */
  store: async function (table) {
    const tbl = this.getTable(table);
    await chrome.storage.local.set({ [table]: JSON.stringify(tbl) });
  },

  /**
   * データを復元
   */
  restore: async function (table, obj) {
    const data = await chrome.storage.local.get([table]);
    if (table in data) {
      Object.assign(obj, JSON.parse(data[table]));
    }
  },

  /**
   * データを挿入
   */
  insert: async function (table, id, itemData) {
    const data = await this.select(table);
    data[id] = itemData;
    await this.store(table);
  },

  /**
   * オブジェクトが空かチェック
   */
  isEmpty: function (obj) {
    return !Object.keys(obj).length;
  },

  /**
   * プレフィックスを追加
   */
  prefix: function (prefix, name) {
    return prefix ? `${prefix}-${name}` : name;
  },

  /**
   * 指定キーのデータを取得
   */
  select: function (table, prefix) {
    let key = this.prefix(prefix, table);
    return options[key] || {};
  },

  /**
   * 指定 ID のデータを取得
   */
  selectId: function (table, id, prefix) {
    const data = this.select(table);
    return data[id];
  },

  /**
   * 指定キーに対応するオブジェクトを取得
   */
  getTable: function (key) {
    if (key === "options") return options;
    if (key === "tmp") return tmp;
    throw new Error("Invalid table name");
  },
};
