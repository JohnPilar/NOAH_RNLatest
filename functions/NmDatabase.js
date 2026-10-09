import React from 'react';
import SQLite from 'react-native-sqlite-storage';
import {NmSaveSetting} from './NmFunctions.tsx';
import {NmGetMobileAppData, NmGetNotificationColumns, NmGetAllNotifications} from './NmNetwork.tsx';
import {APP_CONST, APP_KEYS} from '../constants/NmConstants.js';
import ReactNativeBlobUtil from 'react-native-blob-util';

let RNFS = require('react-native-fs');

//SQLite.DEBUG(true); //Comment out for deployment, un-comment for development

export const NmStartDatabase = () => {
  return new Promise((resolve, reject) => {
    global.dbark = SQLite.openDatabase(
      {
        name: 'ARKCOREDB.db',
        createFromLocation: 2,
      },
      () => {},
      error => {
        resolve(false);
      },
    );
    global.dbnoah = SQLite.openDatabase(
      {
        name: 'NOAH.db',
        createFromLocation: 2,
      },
      () => {},
      error => {
        resolve(false);
      },
    );

    resolve(true);
  });
};

const NmCreateTable = async (tableName, tableColumns) => {
  await global.dbark.transaction(async tx => {
    await tx.executeSql('CREATE TABLE IF NOT EXISTS ' + tableName + ' (ID INTEGER PRIMARY KEY AUTOINCREMENT, ' + tableColumns + ')');
  });
};

const NmCreateNotificationTable = async (tableName, tableColumns) => {
  await global.dbark.transaction(async tx => {
    await tx.executeSql('CREATE TABLE IF NOT EXISTS ' + tableName + ' (' + tableColumns + ')');
  });
};

const NmInsertNewRow = async (tableName, tableColumns, tableData) => {
  await global.dbark.transaction(async tx => {
    await tx.executeSql('INSERT INTO ' + tableName + ' (' + tableColumns + ') VALUES (' + tableData + ')');
  });
};

export const NmInitDatabase = (AssetManager = undefined) => {
  return new Promise((resolve, reject) => {
    let TmpTableNames = [];

    NmGetMobileAppData().then(responseData => {
      if (responseData.status == 200) {
        NmStartDatabase().then(() => {
          const tempAppItems = {};

          tempAppItems.Module = responseData.Module;
          tempAppItems.MenuitemInfo = responseData.MenuitemInfo;
          tempAppItems.MenuDriven = responseData.MenuDriven;

          AssetManager.setAppitems(tempAppItems);
          // let columnNames = '';
          // let columnValues = '';
          // let columnInsertNames = '';
          // let firstRun = true;

          // Object.entries(responseData).forEach(tableName => {
          //   const [tableKey, tableValue] = tableName;

          //   firstRun = true;
          //   Object.entries(responseData[tableKey]).forEach(row => {
          //     const [rowKey, rowValue] = row;
          //     columnNames = '';
          //     columnInsertNames = '';
          //     columnValues = '';
          //     //
          //     Object.entries(rowValue).forEach(col => {
          //       const [colName, colValue] = col;
          //       columnNames += colName + ' TEXT NULL, ';
          //       columnInsertNames += colName + ', ';
          //       columnValues += "'" + colValue + "', ";
          //     });

          //     if (firstRun == true) {
          //       TmpTableNames.push(tableKey);
          //       NmCreateTable(tableKey, columnNames.substr(0, columnNames.length - 2));
          //       firstRun = false;
          //     }

          //     NmInsertNewRow(tableKey, columnInsertNames.substr(0, columnInsertNames.length - 2), columnValues.substr(0, columnValues.length - 2));
          //   });
          // });
          // global.DatabaseTables = TmpTableNames;
          // NmSaveSetting(APP_KEYS.DB_INITIALIZED, true);
          // NmSaveSetting(APP_KEYS.DB_TABLES, global.DatabaseTables);

          resolve(true);
        });
      } else {
        resolve(false);
      }
    });
  });
};

export const NmDropTables = TableName => {
  return new Promise((resolve, reject) => {
    NmStartDatabase().then(r => {
      for (let i = 0; i < TableName.length; i++) {
        global.dbark.transaction(tx => {
          tx.executeSql('DROP TABLE IF EXISTS ' + TableName[i], [], (tx, results) => {
            //(tx);
          });
        });
      }
      resolve(true);
    });
  });
};

export const NmInitializeNotifTable = () => {
  return new Promise((resolve, reject) => {
    NmGetNotificationColumns().then(responseData => {
      if (responseData.status == 200) {
        NmStartDatabase().then(result => {
          let columnNames = '';

          Object.entries(responseData['Table']).forEach(row => {
            const [rowKey, rowValue] = row;

            Object.entries(rowValue).forEach(col => {
              const [colName, colValue] = col;
              columnNames += colValue + ' TEXT NULL, ';
            });
          });

          NmCreateNotificationTable('Notifications', columnNames.substring(0, columnNames.length - 2));
          NmSaveSetting(APP_KEYS.DB_NOTIF, true);
          resolve(true);
        });
      } else {
        resolve(false);
      }
    });
  });
};

///////////////////////////////////////////////////////////////

let LastStampDate = [];

export const getLocalDateStamp = () => {
  return new Promise((resolve, reject) => {
    NmStartDatabase().then(result => {
      if (result) {
        global.dbark.transaction(tx => {
          resolve(true);
        });
      }
    });
  });
};

//================  APPROVER FUNCTIONS FOR DRAWER ITEMS ================//
//

let menuItems = [];

export const NmSelectApprovalItems = () => {
  return new Promise((resolve, reject) => {
    resolve(true);
    // global.dbark.transaction(tx => {
    //   tx.executeSql('SELECT code, description, link, icon FROM MenuitemInfo', [], (tx, results) => {
    //     menuItems = []; //creating empty array to store the rows of the sql table data

    //     for (let i = 0; i < results.rows.length; i++) {
    //       menuItems.push(results.rows.item(i)); //looping through each row in the table and storing it as object in the 'users' array
    //     }
    //     global.menuItems = menuItems;
    //     resolve(true);
    //   });
    // });
  });
};

export const NmInitApprovalDrawerItems = () => {
  return new Promise((resolve, reject) => {
    try {
      let finalDrawerItems = [];
      var tmpDrawerItems = global.menuItems;

      Object.entries(tmpDrawerItems).forEach(item => {
        const [rowID, rowVal] = item;

        let tmpLink = rowVal.link;
        tmpLink = tmpLink.trim();

        //console.log('before mods', tmpLink);

        if (tmpLink.endsWith('/')) {
          tmpLink = tmpLink.substr(0, tmpLink.length - 1);
        }

        let tmpQS = APP_CONST.WEB_QS_NWTKU;
        if (tmpLink.indexOf('&') != -1) {
          tmpLink = tmpLink + '&' + tmpQS.substr(1);
        } else {
          tmpLink = tmpLink + tmpQS;
        }

        //console.log('before object', tmpLink);

        // linkChar = linkChar.endsWith('/') ? linkChar.substr(0, linkChar.length - 1) : linkChar;
        // let trimLink = rowVal.link;
        // trimLink = trimLink.trim();

        var myObj = {
          itemID: rowVal.code,
          link: tmpLink + APP_CONST.WEB_QS_NWTKU,
        };

        finalDrawerItems.push(myObj);
      });

      NmSaveSetting(APP_KEYS.APP_APPROVAL_ITEMS, finalDrawerItems);
      global.ApprovalItems = finalDrawerItems;
      resolve(true);
    } catch (error) {
      console.log('CAI', error);
      resolve(true);
    }
  });
};

//================  GETTING NOTIFICATIONS FROM DATABASE ================//
// These functions can be used if required. Current implementation of notifications
// use JSON format and stored using encrypted storage.

export const NmInitNotificationsTypeDB = (createNew, user) => {
  return new Promise((resolve, reject) => {
    let notifCount = 0;

    NmStartDatabase().then(result => {
      NmGetAllNotifications(user).then(responseData => {
        let columnValues = '';
        let columnInsertNames = '';
        let firstRun = createNew;

        //console.log(responseData['Table'].length);
        notifCount = responseData['Table'].length;

        Object.entries(responseData['Table']).forEach(row => {
          const [rowKey, rowValue] = row;
          columnInsertNames = '';
          columnValues = '';
          //
          Object.entries(rowValue).forEach(col => {
            const [colName, colValue] = col;
            columnInsertNames += colName + ', ';
            columnValues += "'" + colValue + "', ";
          });
          let RefID = rowValue.ReferenceID;

          NmInsertNotificationRow('Notifications', columnInsertNames.substr(0, columnInsertNames.length - 2), columnValues.substr(0, columnValues.length - 2), RefID);
        });

        if (notifCount > 0) {
          NmSelectAllNotifications().then(result => {
            if (result) {
              NmSelectUnreadNotifications().then(result => {
                if (result) {
                  resolve(true);
                }
              });
            }
          });
        } else {
          resolve(true);
        }
      });
    });
  });
};

const NmInsertNotificationRow = async (tableName, tableColumns, tableData, refID) => {
  await global.dbark.transaction(async tx => {
    await tx.executeSql('INSERT INTO ' + tableName + ' (' + tableColumns + ') VALUES (' + tableData + ')');
  });
};

export const NmSelectAllNotifications = () => {
  return new Promise((resolve, reject) => {
    global.dbark.transaction(tx => {
      tx.executeSql('SELECT ReferenceID, Title, Message, NotifType, Recdate FROM Notifications', [], (tx, results) => {
        let notifItems = []; //creating empty array to store the rows of the sql table data

        for (let i = 0; i < results.rows.length; i++) {
          notifItems.push(results.rows.item(i)); //looping through each row in the table and storing it as object in the 'users' array
        }
        //global.NotificationList = notifItems;
        resolve(true);
      });
    });
  });
};

export const NmSelectUnreadNotifications = () => {
  return new Promise((resolve, reject) => {
    global.dbark.transaction(tx => {
      tx.executeSql('SELECT ReferenceID, Title, Message, NotifType, Recdate FROM Notifications WHERE Read = 0', [], (tx, results) => {
        let notifItems = []; //creating empty array to store the rows of the sql table data

        for (let i = 0; i < results.rows.length; i++) {
          notifItems.push(results.rows.item(i)); //looping through each row in the table and storing it as object in the 'users' array
        }
        //console.log(notifItems);
        //global.UnreadNotificationList = notifItems;
        resolve(true);
      });
    });
  });
};

export const NmUpdateNotificationRead = ReferenceID => {
  return new Promise((resolve, reject) => {
    global.dbark.transaction(tx => {
      tx.executeSql("UPDATE Notifications SET Unread='1' WHERE ReferenceID = '" + ReferenceID + "'", [], (tx, results) => {
        //console.log('updated', results.rowsAffected);
        if (results.rowsAffected > 0) {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  });
};

export const NmClearNotificationTable = ReferenceID => {
  return new Promise((resolve, reject) => {
    global.dbark.transaction(tx => {
      tx.executeSql('DELETE FROM Notifications', [], (tx, results) => {
        //console.log(tx);
        resolve(true);
      });
    });
  });
};

export const NmDropNotificationTable = ReferenceID => {
  return new Promise((resolve, reject) => {
    global.dbark.transaction(tx => {
      tx.executeSql('DROP TABLE IF EXISTS Notifications', [], (tx, results) => {
        //console.log(tx);
        resolve(true);
      });
    });
  });
};
