import React, {useState} from 'react';

import {TouchableOpacity, View} from 'react-native';
import DatePicker from 'react-native-date-picker';

import {NmStyles} from '../constants';
import {NmGetDate, NmLowercaseKeys} from './NmFunctions';
import {NmComponentType, TableInputConfig} from '../constants/NmConstants';
import {NmLabel, NmLookup, NmDropdown, NmAddToList, NmTextInput, NmDateModal, NmRadiobutton, NmCheckbox, NmTable} from '../components';

var XDate = require('xdate');

interface NmDynamicRenderProps {
  config: any;
  value: any;
  setValue: (id: any, value: any) => void;
  items: any;
  setItems: any;
  tableData: any;
  setTableData: any;
}

export default function NmDynamicRender(objProps: NmDynamicRenderProps): React.JSX.Element {
  const {config, value, setValue, items, setItems, tableData, setTableData} = objProps;

  switch (config?.type) {
    case NmComponentType.TEXT: {
      const currentValue = value[config.id] || '';
      return (
        <>
          {config?.label && <NmLabel style={[NmStyles.poppinsBold]}>{config.label}</NmLabel>}
          <NmTextInput
            containerStyle={{marginBottom: 10, height: 38}}
            textInputStyle={{marginBottom: -1}}
            value={currentValue}
            onChangeText={value => setValue(config.id, value)}
            placeholder={config?.placeholder}
            editable={config?.enabled}
          />
        </>
      );
    }

    case NmComponentType.DATE: {
      const currentValue = value[config.id] || new XDate().toString('MM/dd/yyyy');
      return (
        <>
          {config?.label && <NmLabel style={[NmStyles.poppinsBold]}>{config.label}</NmLabel>}
          <NmDateModal
            style={{marginBottom: 10, height: 38}}
            setDateValue={value => {
              setValue(config.id, value.toString('MM/dd/yyyy'));
            }}
            dateValue={currentValue}
            pickerMode={'DEVICE'}
            enabled={config?.enabled}
          />
        </>
      );
    }

    case NmComponentType.TIME: {
      return (
        <>
          <DynamicTimePicker config={config} value={value[config.id]} onValueChange={val => setValue(config.id, val)} style={{height: 38}} />
        </>
      );
    }

    case NmComponentType.RADIOBUTTON: {
      return (
        <>
          <NmRadiobutton items={items[config.id]} setRadiobuttonValue={val => setValue(config.id, val.value)} containerStyle={{marginBottom: 0}} enabled={config?.enabled} />
        </>
      );
    }

    case NmComponentType.CHECKBOX: {
      const currentValue = value[config.id] || false;
      return (
        <>
          <NmCheckbox
            value={currentValue}
            onValueChange={(val: any) => setValue(config.id, val)}
            label={config.label}
            labelPlacement={config?.placement}
            style={{marginBottom: 0}}
            checkboxStyle={config?.style}
            enabled={config?.enabled}
          />
        </>
      );
    }

    case NmComponentType.DROPDOWN: {
      const currentValue = value[config.id] || '';
      return (
        <>
          {config?.label && <NmLabel style={[NmStyles.poppinsBold]}>{config.label}</NmLabel>}
          <NmDropdown
            items={items[config.id]}
            setValue={value => {
              setValue(config.id, value);
            }}
            value={currentValue}
            containerStyle={[{marginBottom: 10, height: 38}, config?.containerStyle]}
            disabled={!config?.enabled}
          />
        </>
      );
    }

    case NmComponentType.LOOKUP: {
      const currentValue = value[config.id] || '';
      return (
        <>
          {config?.label && <NmLabel style={[NmStyles.poppinsBold]}>{config.label}</NmLabel>}
          <NmLookup
            lookupTextBoxStyle={{height: 38}}
            lookupButtonStyle={{width: 32, height: 32}}
            queryID={config.qid}
            containerStyle={{marginBottom: 10}}
            value={currentValue}
            setValue={value => {
              // Add config later for custom column values
              setValue(config.id, {code: value.Code, description: value.Description});
            }}
            enabled={config?.enabled}
          />
        </>
      );
    }

    case NmComponentType.ADDTOLIST: {
      return (
        <>
          {config?.label && <NmLabel style={[NmStyles.poppinsBold]}>{config.label}</NmLabel>}
          <NmAddToList
            containerStyle={{width: '100%', marginBottom: 10}}
            // showCols: index > zero based index for the tabs (filters), columns > the columns TO SHOW in the add to list window
            // no value means all columns in the ATL window will show
            showCols={[{index: 3, columns: ['code', 'description']}]}
            componentData={config.params}
            showExpand={config?.showExpand} // enable lookup data long press to show hidden columns (default value is false)
            getValue={val => {
              // val is a 2d array following the order of component data [[region array], [province array], [status array]...]
              setValue(config.id, val);
            }}
            enabled={config?.enabled}
          />
        </>
      );
    }

    case NmComponentType.TABLE: {
      return (
        <>
          <DynamicNmTable config={config} items={tableData} setItems={setTableData} compData={items} />
        </>
      );
    }

    default:
      return <></>;
  }
}

interface DynamicTimePickerProps {
  config: any;
  value: any;
  onValueChange: (value: Date) => void;
  style?: any;
}

const DynamicTimePicker = ({config, value, onValueChange, style}: DynamicTimePickerProps): React.JSX.Element => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const dateValue = value instanceof Date ? value : new Date();

  return (
    <>
      {config?.label && <NmLabel style={[NmStyles.poppinsBold]}>{config.label}</NmLabel>}
      <DatePicker
        modal
        mode="time"
        open={isOpen}
        date={dateValue}
        onConfirm={date => {
          setIsOpen(false);
          onValueChange(date); // Updates the Reducer
        }}
        onCancel={() => setIsOpen(false)}
      />

      <TouchableOpacity
        disabled={!config?.enabled}
        style={[{marginBottom: 10}]}
        onPress={() => {
          setIsOpen(true);
        }}>
        <NmTextInput value={value ? NmGetDate(value, 'customFormat', 'hh:mm a') : ''} editable={false} containerStyle={style} />
      </TouchableOpacity>
    </>
  );
};

interface DynamicNmTableProps {
  config: any;
  items: any;
  setItems: (value: any) => void;
  compData: any;
}

const DynamicNmTable = ({config, items, setItems, compData}: DynamicNmTableProps): React.JSX.Element => {
  return (
    <>
      <View style={[{height: 500, marginTop: 10, paddingBottom: 40, borderRadius: 6, overflow: 'hidden'}, config?.containerStyle]}>
        <NmTable
          tableStyle={config?.tableStyle}
          items={items?.data}
          tableEmpty={items?.isEmpty}
          emptyRowCount={config?.emptyRowCount}
          hiddenColumns={config?.hiddenColumns}
          columnNames={config?.columnNames}
          inputColumns={config.inputColumns?.map((col: any) => {
            if (col.type === TableInputConfig.DROPDOWN) {
              return {
                ...col,
                data: compData[`${config.id}_col${col.index}`] || [],
              };
            }
            return col;
          })}
          changeViewButton={config?.showChangeView}
          // inputColumns={config?.inputColumns}
          // [{
          //   index: 2,
          //   type: TableConfig.LOOKUP,
          //   queryID: '3001',
          //   lookupCols: ['Code', 'Description'], // Columns to select ON THE LOOKUP WINDOW
          //   doneIndex: [2, 3], // Columns to fill on lookup item selection (zero based index with respect to lookupCols)
          // },
          // {
          //   index: 4,
          //   type: TableConfig.DROPDOWN,
          //   data: tableDropdownData,
          // },
          // {
          //   index: 7,
          //   type: TableConfig.REMARKS,
          // },
          // {
          //   index: 2,
          //   type: TableConfig.TIME,
          // },
          // {
          //   index: 3,
          //   type: TableConfig.DATE,
          // }]
          columnWidths={config?.columnWidths} // e.g [{index: 4, width: 200}] - in respect to the table headers
          setItems={newData => {
            setItems((prevTables: any) => ({
              ...prevTables,
              [config.id]: {
                data: NmLowercaseKeys(newData),
              },
            }));
          }}
          tooltipHideDelay={config?.tooltipHideDelay || 4000}
        />
      </View>
    </>
  );
};
