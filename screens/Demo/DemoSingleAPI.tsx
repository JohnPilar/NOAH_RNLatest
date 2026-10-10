import {useContext, useEffect, useState, useReducer} from 'react';
import {View, ScrollView, LogBox} from 'react-native';

import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useRoute} from '@react-navigation/native';

import {NmGetMobileData} from '../../functions/NmNetwork';
import {LoadingPanel} from '../../components';
import {AccountDetailsContext} from '../../functions/Contexts';
import {NmComponentType, NmLocalDataComponents, TableInputConfig} from '../../constants/NmConstants';
import {TableInputConfigTypes} from '../../constructs/types/NmConstantsTypes';
import {NmParseComponentData, NmGetDropdownData, NmHardwareBackPress} from '../../functions/NmFunctions';
import NmDynamicRender from '../../functions/NmDynamicRender';
import {ThemesContext} from '../../functions/ThemeContext';

LogBox.ignoreLogs(['VirtualizedLists should never be nested']);

// useReducer: For saving dynamic multiple data (better than useState)
type FormData = Record<string, any>;

type FormAction =
  | {
      type: 'UPDATE_FIELD';
      fieldId: string;
      value: any;
    }
  | {
      type: 'RESET';
    };

const formReducer = (state: FormData, action: FormAction): FormData => {
  switch (action.type) {
    case 'UPDATE_FIELD':
      return {
        ...state,
        [action.fieldId]: action.value,
      };
    case 'RESET':
      return {};
    default:
      return state;
  }
};

type DemoSingleAPIProps = {
  // Navigation props can be added here when their exact navigator
  // param list is available.
  [key: string]: any;
};

type ScreenConfigItem = {
  id: string;
  label: string;
  type: string;
  qid: string | null;
  enabled: boolean;
  params?: Array<{
    tabName: string;
    queryID: string;
    listColumnID: string;
    listColumnName: string;
    paramName: string;
  }>;
  showChangeView?: boolean;
  autoDeleteLastRow?: boolean;
  hiddenColumns?: number[];
  columnNames?: Array<{
    index: number;
    description: string;
  }>;
  columnWidths?: Array<{
    index: number;
    width: number;
  }>;
  inputColumns?: Array<{
    index: number;
    type: TableInputConfigTypes;
    queryID?: string;
    lookupCols?: string[];
    doneIndex?: number[];
  }>;
};

const DemoSingleAPI = (props: DemoSingleAPIProps) => {
  const {configID} = (useRoute().params as {configID?: string}) || {};

  const {companyCode} = useContext(AccountDetailsContext);
  const {theme} = useContext(ThemesContext);
  const [loading, setLoading] = useState<boolean>(true);

  // For Screen config file
  const [screenConfig, setScreenConfig] = useState<ScreenConfigItem[]>([]);

  // For Table Data
  const [tableData, setTableData] = useState<Record<string, any>>({});

  // For Dropdown Components Data
  const [compData, setCompData] = useState<Record<string, any>>({});

  // Storage of basic data variables
  const [formData, dispatch] = useReducer(formReducer, {});

  // Used for updating single data variables
  const updateValue = (id: string, val: any): void => {
    dispatch({type: 'UPDATE_FIELD', fieldId: id, value: val});
  };

  // ===========================================================================

  // Example data only, get via API
  const SCREEN_CONFIG: ScreenConfigItem[] = [
    {id: 'lkpDynamic', label: 'Dynamic Lookup', type: 'lookup', qid: '1192', enabled: true},
    {id: 'cmbDynamic', label: 'Dynamic Dropdown', type: 'dropdown', qid: '1195', enabled: true},
    {id: 'txtDynamic', label: 'Dynamic Textbox', type: 'text', qid: null, enabled: true},
    {id: 'txtDate', label: 'Dynamic Date Picker', type: 'date', qid: null, enabled: true},
    {id: 'txtTime', label: 'Dynamic Time Picker', type: 'time', qid: null, enabled: true},
    {id: 'chkDynamic', label: 'Dynamic Checkbox', type: 'checkbox', qid: null, enabled: true},
    {id: 'radDynamic', label: 'Dynamic Radiobutton', type: 'radiobutton', qid: '4000', enabled: true},
    {
      id: 'atlDynamic',
      label: 'Dynamic Add to List',
      type: 'addtolist',
      qid: null,
      enabled: false,
      params: [
        {
          tabName: 'Region',
          queryID: '1192',
          listColumnID: '',
          listColumnName: 'Description',
          paramName: 'code',
        },
        {
          tabName: 'Province',
          queryID: '1193',
          listColumnID: 'Code',
          listColumnName: 'Description',
          paramName: 'compcode',
        },
        {
          tabName: 'Status',
          queryID: '1194',
          listColumnID: 'code',
          listColumnName: 'description',
          paramName: 'compcode',
        },
        {
          tabName: 'Status (Hidden columns)',
          queryID: '1194',
          listColumnID: 'code',
          listColumnName: 'description',
          paramName: 'compcode',
        },
      ],
    },
    {
      id: 'tblDynamic',
      label: 'Dynamic Table',
      type: 'table',
      qid: '3000',
      showChangeView: true,
      enabled: true,
      autoDeleteLastRow: true,
      hiddenColumns: [8, 9, 10, 11],
      columnNames: [
        {index: 2, description: 'Position Code'},
        {index: 3, description: 'Description'},
        {index: 4, description: 'Dropdown'},
      ],
      columnWidths: [{index: 4, width: 200}],
      inputColumns: [
        {
          index: 0,
          type: TableInputConfig.TEXT as TableInputConfigTypes,
        },
        {
          index: 2,
          type: TableInputConfig.LOOKUP as TableInputConfigTypes,
          queryID: '3001',
          lookupCols: ['Code', 'Description'],
          doneIndex: [2, 3],
        },
        {
          index: 4,
          type: TableInputConfig.DROPDOWN as TableInputConfigTypes,
          queryID: '2001',
        },
        {
          index: 7,
          type: TableInputConfig.DOCVIEW as TableInputConfigTypes,
        },
      ],
    },
  ];

  useEffect(() => {
    const loadScreenData = async () => {
      try {
        const configRes = await NmGetMobileData({_compcode: companyCode, qid: 'configID'});
        // const tempConfig = configRes?.status === '200' ? configRes.data.data : SCREEN_CONFIG;
        const tempConfig = SCREEN_CONFIG; // For your current testing

        if (!tempConfig?.length) return;

        const dataFields = tempConfig.filter(f => f?.qid && NmLocalDataComponents.includes(f.type));
        const generalResults = await Promise.all(dataFields.map(f => NmGetMobileData({_compcode: companyCode, qid: f.qid!})));

        const fetchedData: Record<string, any> = {};
        const dropdownData: Record<string, any> = {};
        const columnPromises: Promise<void>[] = [];

        generalResults.forEach((res, index) => {
          const field = dataFields[index];

          if (res?.status === '200') {
            if (field.type == NmComponentType.DROPDOWN || field.type == NmComponentType.RADIOBUTTON) {
              dropdownData[field.id] = NmGetDropdownData(res.data.data);
            } else {
              fetchedData[field.id] = NmParseComponentData(field.type, res.data.data);
            }

            // Check for Table Dropdowns
            if (field.type == NmComponentType.TABLE && field.inputColumns) {
              const dynamicCols = field.inputColumns.filter(col => col.queryID && col.type == TableInputConfig.DROPDOWN);

              dynamicCols.forEach(col => {
                // We push a promise that, when resolved, adds data to fetchedData
                const promise = NmGetMobileData({
                  _compcode: companyCode,
                  qid: col.queryID!,
                }).then(colRes => {
                  if (colRes?.status === '200') {
                    const storageKey = `${field.id}_col${col.index}`;
                    dropdownData[storageKey] = NmGetDropdownData(colRes.data.data);
                  }
                });

                columnPromises.push(promise);
              });
            }
          }
        });

        await Promise.all(columnPromises);
        setTableData(fetchedData);
        setCompData(dropdownData);
        setScreenConfig(tempConfig);
      } catch (err) {
        console.error('Critical error in loadScreenData:', err);
      } finally {
        setLoading(false);
      }
    };

    loadScreenData();
  }, []);

  useEffect(() => {
    if (screenConfig.length > 0) {
      setLoading(false);
    }
  }, [screenConfig]);

  // ===========================================================================

  NmHardwareBackPress(() => {
    props.navigation.navigate('Home');
    return true;
  });

  // useEffect(() => {
  //   console.log('formData values', formData);
  // }, [formData]);

  // useEffect(() => {
  //   console.log('compData values', tableData);
  // }, [tableData]);

  return (
    <View style={{flex: 1, width: '100%', backgroundColor: theme.backgroundColor}}>
      {loading && <LoadingPanel />}
      <View style={{padding: 12, marginTop: useSafeAreaInsets().top}}>
        <ScrollView contentContainerStyle={{flexGrow: 1}}>
          {screenConfig.map(compConfig => {
            return (
              <NmDynamicRender
                key={compConfig.id}
                config={compConfig}
                items={compData} // For Dropdown
                setItems={setCompData}
                tableData={tableData[compConfig.id]} // For Table
                setTableData={setTableData} // For setting/updating table data
                value={formData} // For single value components
                setValue={updateValue} // For setting/updating single value components
              />
            );
          })}

          {/*
          <NmLabel style={[NmStyles.poppinsBold]}>{'Example Save Grid'}</NmLabel>
          <NmButton title={'Save Table Data'} onPress={() => {}} />
          */}
        </ScrollView>
      </View>
    </View>
  );
};

export default DemoSingleAPI;
