import React, {useContext, useState, useEffect} from 'react';
import {View, StyleSheet, TextInput, Text, TouchableOpacity, FlatList, Image, useWindowDimensions, ScrollView} from 'react-native';

import {ThemesContext} from '../functions/ThemeContext';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Modal from 'react-native-modal';

import {NmTitleCase} from '../functions/NmFunctions';
import {NmLabel} from './NmComponents';
import NmButton from './NmButton';
import {NmStyles} from '../constants';
import {AccountDetailsContext} from '../functions/Contexts';
import {LoadingPanel} from './NmLoadingComponents';
import {NmGetMobileData} from '../functions/NmNetwork';

interface NmAddToListProps {
  containerStyle?: any;
  getValue?: (value: any) => void;
  sampleData?: any[];
  showCols?: any[];
  showExpand?: boolean;
  headerText?: string;
  demoMode?: boolean;
  componentData?: any[];
  enabled?: boolean;
  iconStyle?: any;
}

interface FinalDataItem {
  tabName: any;
  queryID: any;
  listColumnID: any;
  listColumnName: any;
  paramName: any;
}

export default function NmAddToList(props: NmAddToListProps): React.JSX.Element {
  const {theme} = useContext(ThemesContext);
  const {companyCode} = useContext(AccountDetailsContext);
  const {height, width} = useWindowDimensions();

  const {containerStyle, getValue, sampleData, showCols, showExpand = false, headerText, demoMode, componentData, enabled, iconStyle} = props || {};
  const [searchValue, setSearchValue] = useState<string>('');
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const [selectedList, setSelectedList] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState<boolean>(false);
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const [tabListData, setTabListData] = useState<any[]>([]);
  const [filterList, setFilterList] = useState<any[][]>([]);
  const [origTabListData, setOrigTabListData] = useState<any[]>([]);
  const [displayColumns, setDisplayColumns] = useState<any[]>([]);

  const [finalData, setFinalData] = useState<Array<any>>([]);
  const dataKeys: string[] = ['tabName', 'queryID', 'listColumnID', 'listColumnName', 'paramName'];

  useEffect((): void => {
    if (Array.isArray(componentData) && componentData?.length > 0) {
      const validCompData = componentData?.filter(item => dataKeys.every(key => item.hasOwnProperty(key))) ?? [];

      setFinalData(validCompData);
      setFilterList(new Array(validCompData.length));
    } else {
      setFinalData(sampleData ?? []);
      setFilterList(new Array(sampleData?.length));
    }
  }, []);

  useEffect((): void => {
    if (modalVisible && !demoMode) {
      const paramsObject = {
        [finalData[activeIndex].paramName]: getParams(),
      };
      NmGetMobileData({qid: finalData[activeIndex].queryID, qpr: paramsObject, _compcode: companyCode}).then(response => {
        if (response?.status == '200') {
          setTabListData(response.data.data);
          setOrigTabListData(response.data.data);
        }
        setLoading(false);
      });
    }

    if (!modalVisible && !demoMode) {
      setLoading(true);
      setTabListData([]);
      setOrigTabListData([]);
    }

    if (modalVisible) {
      if (showCols && showCols?.length > 0) {
        const withHiddenIndex = showCols.findIndex(item => item.index == activeIndex);
        if (withHiddenIndex >= 0) {
          setDisplayColumns(showCols[withHiddenIndex].columns);
        }
      }
    } else {
      setDisplayColumns([]);
    }

    // if (demoMode) {
    //   setTabListData(sampleData[activeIndex]);
    //   setOrigTabListData(sampleData[activeIndex]);
    // }
  }, [modalVisible]);

  useEffect((): void => {
    if (demoMode) {
      let tmpLookupData = getCurrentLookupData();
      let indexCollection: number[] = [];

      filterList[activeIndex]?.forEach(filter => {
        const removeIndex = tmpLookupData?.findIndex(data => data.code == filter.code);
        if (removeIndex != -1) {
          indexCollection.push(removeIndex);
        }
      });
      indexCollection?.forEach(i => {
        tmpLookupData[i] = undefined;
      });
      tmpLookupData = tmpLookupData?.filter(i => i != undefined);
      setTabListData(tmpLookupData);
    }

    getValue?.(filterList);
  }, [activeIndex, filterList]);

  function hideModal(): void {
    setModalVisible(false);
    setSelectAll(false);
    setSearchValue('');
    setSelectedList([]);
  }

  function updateItemList(itemIndex: number): void {
    setSelectedList(prev => {
      if (prev.includes(itemIndex)) {
        return prev.filter(id => id !== itemIndex);
      } else {
        return [...prev, itemIndex];
      }
    });
  }

  function addItemsToList(): void {
    let tmpFilter = [...filterList];

    let tmpFilterList = tmpFilter[activeIndex] == undefined ? [] : tmpFilter[activeIndex];
    selectedList.forEach(i => {
      if (finalData[activeIndex].listColumnID == '' || demoMode) {
        // in case no column name is provided as ID
        const dataID = JSON.stringify(tabListData[i]);
        const dataIndex = tmpFilterList.findIndex(item => JSON.stringify(item)?.toString().toLowerCase() == dataID?.toString().toLowerCase());
        if (dataIndex < 0) {
          tmpFilterList.push(tabListData[i]);
        }
      } else {
        tmpFilterList.push(tabListData[i]);
      }
    });
    tmpFilter[activeIndex] = tmpFilterList;
    setFilterList(tmpFilter);
    hideModal();
  }

  function clearList(): void {
    let tmpFilter = [...filterList];
    tmpFilter[activeIndex] = [];
    setFilterList(tmpFilter);
  }

  function removeItem(itemIndex: number): void {
    let tmpFilter = [...filterList];
    let tmpFilterList = tmpFilter[activeIndex];
    tmpFilterList.splice(itemIndex, 1); // Changed item removal to index based
    // tmpFilterList = tmpFilterList.filter(i => i.code != item.code);
    tmpFilter[activeIndex] = tmpFilterList;
    setFilterList(tmpFilter);
  }

  function getCurrentLookupData(): any[] {
    if (demoMode) {
      try {
        let filteredLookupData;
        filteredLookupData = [...(sampleData?.[activeIndex] ?? [])];
        return filteredLookupData;
      } catch (e) {
        return [];
      }
    } else {
      return tabListData;
    }
  }

  const getParams = (): string => {
    let listFilters = filterList[activeIndex];
    let currentParams = '';
    listFilters?.forEach(item => {
      const tmpParams = item[finalData[activeIndex].listColumnID];
      if (tmpParams) currentParams += item[finalData[activeIndex].listColumnID] + '|';
    });
    return currentParams;
  };

  const handleSearch = (): void => {
    setLoading(true);
    const formattedQuery = searchValue.toLowerCase();
    const filteredData = origTabListData.filter(item => {
      return Object.values(item).some(value => String(value).toLowerCase().includes(formattedQuery));
    });

    setTabListData(filteredData);
    setLoading(false);
  };

  const renderItem = React.useCallback(
    ({item, index}: {item: any; index: number}): React.JSX.Element => {
      const isSelected = selectedList.includes(index);
      return (
        <LookUpItem
          theme={theme}
          item={item}
          itemIndex={index}
          isSelected={isSelected}
          //hideModal={hideModal}
          //setItems={setSelectedList}
          updateList={updateItemList}
          //selectedList={selectedList}
          showCols={displayColumns}
          showExpand={showExpand}
        />
      );
    },

    [theme, selectedList, showCols, showExpand, updateItemList],
  );

  return (
    <View style={[containerStyle]}>
      {/* ----- Add to List Pop-up ----- */}
      <Modal
        propagateSwipe={true}
        isVisible={modalVisible}
        backdropOpacity={0.4}
        onBackdropPress={() => {
          hideModal();
        }}
        style={[{alignItems: 'center', justifyContent: 'center', margin: 0, width: '100%', paddingHorizontal: 6}]}
        animationIn="slideInRight"
        animationOut="slideOutLeft"
        backdropTransitionOutTiming={0}
        onBackButtonPress={() => hideModal()}>
        <View style={{width: '100%', maxHeight: height * 0.9, alignItems: 'center', backgroundColor: theme.atlWindowBackground, borderRadius: 6, overflow: 'hidden'}}>
          <View>
            {loading && <LoadingPanel />}
            <View
              style={{
                height: 46,
                backgroundColor: theme.atlWindowHeader,
                width: '100%',
                borderTopStartRadius: 6,
                borderTopEndRadius: 6,
                justifyContent: 'space-between',
                alignItems: 'center',
                flexDirection: 'row',
                overflow: 'hidden',
              }}>
              <TouchableOpacity
                style={{height: '100%', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 12}}
                onPress={() => {
                  hideModal();
                }}>
                <MaterialCommunityIcons name={'keyboard-backspace'} size={24} color={'#FFF'} />
              </TouchableOpacity>
              <Text style={[NmStyles.poppinsMedium, {color: '#FFF', marginBottom: -2, paddingRight: 12}]}>{'Look Up'}</Text>
            </View>

            <View style={{padding: 6}}>
              <View style={[styles.lookupTextBox, {backgroundColor: theme.atlWindowSearch, borderColor: theme.atlWindowSearchBorder}]}>
                <TextInput style={[NmStyles.textInput, {color: theme.atlWindowSearchText}]} onChangeText={(value: string) => setSearchValue(value)} value={searchValue} />
                <TouchableOpacity
                  onPress={() => {
                    handleSearch();
                  }}
                  activeOpacity={0.6}
                  style={[styles.lookupButtonStyle, {backgroundColor: theme.atlWindowSearchButton}]}>
                  <MaterialCommunityIcons name={'magnify'} style={[iconStyle]} size={24} color={'#FFF'} />
                </TouchableOpacity>
              </View>
            </View>

            {tabListData != undefined && tabListData.length > 0 ? (
              <View style={{flex: 1, paddingHorizontal: 6, paddingBottom: 8}}>
                <FlatList
                  data={tabListData}
                  renderItem={renderItem}
                  keyExtractor={(value, index) => index.toString()}
                  extraData={selectedList}
                  contentContainerStyle={{flexGrow: 0, borderRadius: 6, overflow: 'hidden', height: undefined}}
                />
              </View>
            ) : (
              <View style={{alignItems: 'center', justifyContent: 'center', paddingVertical: 40}}>
                <NmLabel style={[NmStyles.poppinsBold, {color: '#AAA', fontSize: 18}]}>{'No Data'}</NmLabel>
              </View>
            )}

            <View style={{paddingBottom: 8, paddingHorizontal: 6}}>
              <NmButton style={{borderRadius: 6}} disabled={true} title={(tabListData?.length > 0 ? tabListData.length + ' ' : '') + 'Record(s) Found'} />

              <View style={{flexDirection: 'row', marginTop: 8}}>
                <NmButton
                  style={{flex: 1, width: undefined, borderRadius: 6, marginRight: 4}}
                  disabled={tabListData?.length > 0 ? false : true}
                  title={selectAll ? 'Deselect All' : 'Select All'}
                  onPress={() => {
                    let tmpArray: number[] = [];

                    if (selectAll == false) {
                      tabListData.forEach((item, index) => {
                        tmpArray.push(index);
                      });
                    }
                    setSelectedList(tmpArray);

                    setSelectAll(!selectAll);
                  }}
                />
                <NmButton
                  style={{flex: 1, width: undefined, borderRadius: 6, marginLeft: 4}}
                  disabled={selectedList?.length > 0 ? false : true}
                  title={'Add To List'}
                  onPress={() => {
                    addItemsToList();
                  }}
                />
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {/* ----- Main Component ----- */}

      <View style={{width: '100%', backgroundColor: theme.atlBackground, paddingTop: 5, paddingBottom: 10, paddingHorizontal: 10, borderRadius: 6}}>
        <NmLabel style={[NmStyles.poppinsMedium, {fontSize: 20}]}>{headerText == undefined ? 'Filter By' : headerText}</NmLabel>
        <View style={{width: '100%', height: 1, backgroundColor: '#8ebcea', marginBottom: 5}}></View>
        <FlatList
          data={finalData}
          renderItem={({item, index}: {item: FinalDataItem; index: number}) => <TabHeader item={item} index={index} activeIndex={activeIndex} setActiveIndex={setActiveIndex} theme={theme} />}
          keyExtractor={(item, index) => index.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
        {finalData.map((item, index) => {
          return (
            <TabComponent
              key={index}
              theme={theme}
              index={index}
              activeIndex={activeIndex}
              btnAdd={() => {
                setModalVisible(true);
              }}
              btnClear={() => {
                clearList();
              }}
              filterList={filterList}
              removeItem={(item: number) => {
                removeItem(item);
              }}
              customDesc={finalData[index].listColumnName}
              {...props}
              enabled={enabled}
            />
          );
        })}
      </View>
    </View>
  );
}

interface TabHeaderProps {
  index: number;
  item: FinalDataItem;
  activeIndex: number;
  setActiveIndex: (index: number) => void;
  theme: any;
}

const TabHeader = (props: TabHeaderProps): React.JSX.Element => {
  const {index, item, activeIndex, setActiveIndex, theme} = props;

  return (
    <TouchableOpacity
      key={index}
      style={{alignItems: 'center'}}
      onPress={() => {
        if (index != activeIndex) {
          setActiveIndex(index);
        }
      }}>
      <View style={{paddingVertical: 4, paddingHorizontal: 12}}>
        <NmLabel style={[NmStyles.poppinsMedium, {color: index == activeIndex ? '#2E7FF9' : '#a5a5a5ff'}]}>{item.tabName}</NmLabel>
      </View>
      {index == activeIndex && <View style={{width: 20, height: 2, backgroundColor: '#2E7FF9'}}></View>}
    </TouchableOpacity>
  );
};

interface TabComponentProps {
  index: number;
  activeIndex: number;
  filterList: any[][];
  btnAdd: () => void;
  btnClear: () => void;
  removeItem: (itemIndex: number) => void;
  customDesc?: string;
  theme: any;
  enabled?: boolean;
  listContainerStyle?: any;
}

const TabComponent = (props: TabComponentProps): React.JSX.Element | false => {
  const {index, activeIndex, filterList, btnAdd, btnClear, removeItem, customDesc, theme, enabled} = props;

  return (
    index == activeIndex && (
      <View style={{width: '100%'}}>
        <View style={{flexDirection: 'row', width: '60%', paddingBottom: 12, paddingTop: 8}}>
          <NmButton disabled={!enabled} title={'Add to list'} style={{flex: 1, width: undefined, flexDirection: 'row', height: 36, marginRight: 2}} titleStyle={{marginBottom: -1}} onPress={btnAdd}>
            <Image source={require('../assets/Icons/noah_addtolist.png')} style={{marginRight: 5}} />
          </NmButton>
          <NmButton disabled={!enabled} title={'Clear list'} style={{flex: 1, width: undefined, flexDirection: 'row', height: 36, marginLeft: 2}} titleStyle={{marginBottom: -1}} onPress={btnClear}>
            <Image source={require('../assets/Icons/noah_clearlist.png')} style={{marginRight: 5}} />
          </NmButton>
        </View>

        <View style={[{width: '100%', backgroundColor: theme.atlTextBackground, borderRadius: 6, minHeight: 100, maxHeight: 200, overflow: 'hidden', padding: 2}, props.listContainerStyle]}>
          <ScrollView nestedScrollEnabled={true}>
            {filterList[index]?.map((item, index) => {
              return (
                <View key={index} style={{width: '100%', padding: 2}}>
                  <View
                    style={{
                      backgroundColor: theme.atlTextItemBackground,
                      borderColor: theme.atlTextBorder,
                      borderWidth: StyleSheet.hairlineWidth,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                      paddingVertical: 5,
                      paddingHorizontal: 5,
                      borderRadius: 6,
                    }}>
                    {/* Add additional logic to display custom columns (e.g. Code, other columns) */}
                    <NmLabel style={{marginBottom: -3}}>{customDesc != undefined ? item[customDesc] : item?.description}</NmLabel>
                    <TouchableOpacity
                      onPress={() => {
                        removeItem(index);
                      }}>
                      <MaterialCommunityIcons name={'close'} style={{marginLeft: 5}} size={18} color={'#FF000077'} />
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </ScrollView>
        </View>
      </View>
    )
  );
};

interface ItemRowProps {
  mIndex: number;
  colName: any;
  colVal: any;
}

const ItemRow = ({mIndex, colName, colVal}: ItemRowProps): React.JSX.Element => {
  return (
    <View key={mIndex} style={{width: '100%', flexDirection: 'row'}}>
      <View style={{flex: 1}}>
        <NmLabel style={[NmStyles.poppinsBold]}>{colName}</NmLabel>
      </View>
      <View style={{flex: 2}}>
        <NmLabel style={{}}>{colVal}</NmLabel>
      </View>
    </View>
  );
};
const LookUpItem = React.memo(
  ({
    theme,
    item,
    itemIndex,
    showCols,
    showExpand,
    updateList,
    isSelected,
  }: {
    theme: any;
    item: any;
    itemIndex: number;
    showCols: string[];
    showExpand: boolean;
    updateList: (itemIndex: number) => void;
    isSelected: boolean;
  }): React.JSX.Element => {
    const [showAllCols, setShowAllCols] = useState<boolean>(false);

    return (
      <TouchableOpacity
        activeOpacity={0.6}
        style={{width: '100%', marginBottom: 8}}
        onPress={() => {
          updateList(itemIndex);
        }}
        delayLongPress={300}
        onLongPress={() => {
          if (showCols?.length > 0 && showExpand == true) {
            setShowAllCols(!showAllCols);
          }
        }}>
        <View
          style={{
            backgroundColor: isSelected ? '#2E7FF933' : theme.atlWindowItemBackground,
            width: '100%',
            borderWidth: StyleSheet.hairlineWidth,
            borderColor: isSelected ? '#2E7FF9' : theme.atlWindowItemBorder,
            borderRadius: 6,
            flexDirection: 'row',
            overflow: 'hidden',
          }}>
          <View style={{flex: 1, width: '100%', padding: 6, paddingTop: 8, paddingLeft: 8}}>
            {Object.keys(item).map((key, index) => {
              if (showCols.length > 0) {
                if (showCols.includes(key.toString().toLowerCase())) {
                  return <ItemRow key={index} mIndex={index} colName={NmTitleCase(key)} colVal={item[key]} />;
                } else {
                  return showAllCols && <ItemRow key={index} mIndex={index} colName={NmTitleCase(key)} colVal={item[key]} />;
                }
              } else {
                return <ItemRow key={index} mIndex={index} colName={NmTitleCase(key)} colVal={item[key]} />;
              }
            })}
          </View>
        </View>
      </TouchableOpacity>
    );
  },
);

const styles = StyleSheet.create({
  lookupTextBox: {
    width: '100%',
    borderWidth: 1,
    borderRadius: 6,
    overflow: 'hidden',
    height: 45,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lookupTextStyle: {
    height: '100%',
    flex: 1,
    padding: 0,
    paddingLeft: 10,
    color: '#000',
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    textAlignVertical: 'center',
    marginBottom: -2,
  },
  lookupButtonStyle: {
    width: 38,
    height: 38,
    borderRadius: 6,
    backgroundColor: '#2E7FF9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 2,
  },
});
