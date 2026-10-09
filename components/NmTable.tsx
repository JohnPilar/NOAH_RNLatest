import React, {useContext, useEffect, useMemo, useState, useRef} from 'react';
import {StyleSheet, Text, View, ScrollView, FlatList, TouchableOpacity, Dimensions, Image, TextInput, ViewStyle} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import NmToastModal from './NmToastModal';
import NmTableEditModal from './NmTableEditModal';
import {APP_CONST, NmColors} from '../constants';
import {NmGetDisplayFormat, NmGetEditFormat, NmSanitizeData, NmTitleCase} from '../functions/NmFunctions';
import {ThemesContext} from '../functions/ThemeContext';
import NmLookupModal from './NmLookupModal';
import {TableInputConfig} from '../constants/NmConstants';
import {NmLabel} from './NmComponents';
import NmModalRemarks from './NmModalRemarks';
import {UIConfig} from '../Global/UIConfig';
import NmTextInput from './NmTextInput';
import {WINDOW_WIDTH} from '../constants/NmStyles';

const screenWidth = Dimensions.get('window').width;

interface NmTableProps {
  items?: any[];
  setItems?: (items: any[]) => void;
  style?: any;
  tableStyle?: any;
  tableEmpty?: boolean;
  emptyRowCount?: number;
  hiddenColumns?: number[];
  columnNames?: any[];
  columnWidths?: any[];
  inputColumns?: any[];
  tooltipHideDelay?: number;
  defaultColWidth?: number;
  changeViewButton?: boolean;
  addRowButton?: boolean;
  copyRowButton?: boolean;
  deleteRowButton?: boolean;
  resetColWidthButton?: boolean;
  autoDeleteLastRow?: boolean;
  showSearch?: boolean;
}

const NmTable = (props: NmTableProps): React.JSX.Element => {
  const {theme} = useContext(ThemesContext);
  const {
    items,
    setItems,
    style,
    tableStyle = APP_CONST.SPREAD_TYPE_LIST,
    tableEmpty,
    emptyRowCount = 3,
    hiddenColumns,
    columnNames,
    columnWidths,
    inputColumns,
    tooltipHideDelay = 3000,
    defaultColWidth = 150,
    changeViewButton = false,
    addRowButton = true,
    copyRowButton = true,
    deleteRowButton = true,
    resetColWidthButton = true,
    autoDeleteLastRow = false,
    showSearch = true,
  } = props || {};

  const listRef = useRef<any>(null);
  const gridRef = useRef<any>(null);
  const listItemHeight = useRef<any>(null);
  const listItemWidth = useRef<any>(null);
  const horizontalScrollViewRef = useRef<React.ComponentRef<typeof ScrollView>>(null);
  const gridColumnWidths = useRef<any[]>([]);

  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [modalLookupVisible, setModalLookupVisible] = useState<boolean>(false);
  const [showRemarks, setShowRemarks] = useState<boolean>(false);
  const [inputVisible, setInputVisible] = useState<boolean>(false);
  const [pressedIndex, setPressedIndex] = useState<number>(-1);
  const [queryID, setQueryID] = useState<string>('');

  const [cellVal, setCellVal] = useState<any>();
  const [cellRow, setCellRow] = useState<number>();
  const [cellCol, setCellCol] = useState<number>();
  const [activeInputConfig, setActiveInputConfig] = useState<any>();
  const [configType, setConfigType] = useState<any>();

  const [tableData, setTableData] = useState<any[]>([]);
  const [colWidths, setColWidths] = useState<any[]>([]);
  const [tableHeader, setTableHeader] = useState<any[]>([]);

  const [tooltipVisible, setTooltipVisible] = useState<boolean>(false);
  const [tooltipText, setTooltipText] = useState<string>('');
  const [tableView, setTableView] = useState<any>(tableStyle);

  const [searchValue, setSearchValue] = useState<string>('');
  const [matchIndices, setMatchIndices] = useState<any[]>([]);
  const [currentMatchPointer, setCurrentMatchPointer] = useState<number>(-1);

  const inputMap = useMemo(() => {
    if (!inputColumns) return {};
    return inputColumns.reduce((acc: Record<number, any>, curr: any) => {
      acc[curr.index] = curr;
      return acc;
    }, {});
  }, [inputColumns]);

  useEffect(() => {
    if (items && items.length > 0) {
      const allKeys = Object.keys(items[0]);

      const visibleKeys = allKeys.filter((_, index) => {
        return !hiddenColumns?.includes(index);
      });

      const headersWithDescriptions = visibleKeys.map((key, visibleIndex) => {
        const originalIndex = allKeys.indexOf(key);
        const customHeader = columnNames?.find(col => col.index == originalIndex);

        return {
          index: originalIndex,
          key: key,
          name: customHeader ? customHeader.description : key,
        };
      });

      setTableHeader(headersWithDescriptions);
      setTableData(() => {
        if (!tableEmpty) {
          return items;
        } else {
          const emptyTemplate = {...items[0]};
          const placeholderArray: any[] = [];

          for (let i = 0; i < emptyRowCount; i++) {
            placeholderArray.push({...emptyTemplate});
          }

          return placeholderArray;
        }
      });

      if (columnWidths) {
        setColWidths(columnWidths);
      }
    }
  }, [items, hiddenColumns, columnNames, tableView]);

  const lastTap = React.useRef<number>(0);

  const handlePress = (value: any, rowIndex: number, colIndex: number): void => {
    const now = Date.now();
    const DOUBLE_PRESS_DELAY = 300;

    const inputConfig = inputColumns?.find(col => col.index === colIndex);

    if (lastTap.current && now - lastTap.current < DOUBLE_PRESS_DELAY) {
      if (inputConfig) {
        const sanitizedValue = NmSanitizeData(inputConfig?.type, value);

        setCellVal(sanitizedValue);
        setCellRow(rowIndex);
        setCellCol(colIndex);

        setActiveInputConfig(inputConfig);
        setConfigType(inputConfig?.type);

        switch (inputConfig?.type) {
          case TableInputConfig.LOOKUP:
            setQueryID(inputConfig?.queryID);
            setModalLookupVisible(true);
            break;
          case TableInputConfig.REMARKS:
            setShowRemarks(true);
            break;
          default:
            setModalVisible(true);
            break;
        }
      }
    } else {
      lastTap.current = now;
    }
  };

  const renderHeader = ({item, index}: {item: any; index: number}): React.JSX.Element => {
    //const colnamePrefix = item.key.startsWith('btn') || item.key.startsWith('dis') ? true : false;
    const colName = item.name;
    const customWidth = colWidths?.find(item => item.index === index)?.width || defaultColWidth;

    return (
      <TouchableOpacity
        onPress={() => {
          const now = Date.now();
          const DOUBLE_PRESS_DELAY = 300;

          if (lastTap.current && now - lastTap.current < DOUBLE_PRESS_DELAY) {
            setCellVal(customWidth || defaultColWidth);
            setCellCol(index);

            setActiveInputConfig({
              index: index,
              type: TableInputConfig.COLWIDTH,
              defaultWidth: defaultColWidth,
            });

            setConfigType(TableInputConfig.COLWIDTH);
            setModalVisible(true);
          } else {
            lastTap.current = now;
          }
        }}
        key={index}
        style={{
          width: customWidth,
          backgroundColor: theme.spreadGridHeaderBackground,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: '#000',
          alignItems: 'center',
          padding: 4,
        }}>
        <Text style={[styles.gridColumnTitle, {marginLeft: -4, fontWeight: 900, color: theme.spreadGridHeader}]} numberOfLines={1}>
          {NmTitleCase(colName)}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderRow = ({item, index}: {item: any; index: number}): React.JSX.Element => {
    const isSelected = pressedIndex === index;
    const isLastRow = index === tableData.length - 1;
    const isGrid = tableView === APP_CONST.SPREAD_TYPE_GRID;

    const containerStyle: ViewStyle = {
      backgroundColor: isGrid ? (isSelected ? NmColors.buttonLight : '#FFF') : theme.spreadListBackground,
      flexDirection: isGrid ? 'row' : 'column',
      alignItems: isGrid ? 'center' : 'stretch',

      marginBottom: isGrid ? 0 : 10,
      borderRadius: isGrid ? 0 : 6,
      overflow: isGrid ? 'visible' : 'hidden',
      borderWidth: isGrid ? 0 : 1,

      borderColor: isGrid ? 'transparent' : isSelected ? theme.spreadListItemFirstRowPressed : '#ffffff00',
    };

    return (
      <View
        style={containerStyle}
        key={index}
        onLayout={event => {
          if (index === 0) {
            const {height, width} = event.nativeEvent.layout;
            listItemHeight.current = height;
            listItemWidth.current = width;
          }
        }}>
        {tableHeader.map((hdr, itemIndex) => {
          const inputConfig = inputMap[hdr.index];

          const lookupBG = inputConfig?.type == TableInputConfig.LOOKUP ? theme.spreadListLookupBackground : isGrid ? theme.spreadGridItemBackground : theme.spreadListItemBackground;
          const isRemarks = inputConfig?.type == TableInputConfig.REMARKS;
          const isDocViewing = inputConfig?.type == TableInputConfig.DOCVIEW;
          const isDropdown = inputConfig?.type == TableInputConfig.DROPDOWN;

          const textColor = isRemarks ? '#FFF' : isGrid ? theme.spreadGridData : theme.spreadListItemDescription;
          const TableData = isRemarks ? '. . .' : NmGetDisplayFormat(inputConfig?.type, item[hdr.key], inputConfig?.data);

          const customWidth = colWidths?.find(c => c.index === itemIndex)?.width || defaultColWidth;
          const isSearchMatch =
            matchIndices.length > 0 && currentMatchPointer !== -1 && matchIndices[currentMatchPointer].rowIndex === index && matchIndices[currentMatchPointer].colIndex === itemIndex;

          const isDisabled = hdr.key.startsWith('dis');

          if (tableView === APP_CONST.SPREAD_TYPE_LIST) {
            return (
              <TouchableOpacity
                activeOpacity={0.5}
                key={itemIndex}
                style={{
                  alignItems: 'center',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  backgroundColor: itemIndex == 0 ? theme.spreadListItemFirstRow : theme.spreadListItemBackground,
                  paddingHorizontal: 5,
                  paddingVertical: 3,
                }}
                onPress={() => setPressedIndex(index)}>
                <View style={{flex: 1}}>
                  <Text style={[styles.itemName, {color: theme.spreadListItemCode}]} numberOfLines={1}>
                    {NmTitleCase(hdr.name)}
                  </Text>
                </View>
                <TouchableOpacity
                  style={{
                    flex: 2,
                    flexDirection: 'row',
                    justifyContent: isRemarks ? 'center' : 'flex-end',
                    backgroundColor: isSearchMatch ? '#00d60b7e' : isRemarks ? (item[hdr.key] ? '#008080' : '#ef7f11') : itemIndex == 0 ? theme.spreadListItemFirstRow : lookupBG,
                  }}
                  onPress={() => {
                    handlePress(item[hdr.key], index, itemIndex);
                    setPressedIndex(index);
                  }}
                  onLongPress={() => {
                    setTooltipText(TableData);
                    setTooltipVisible(true);
                  }}
                  delayLongPress={200}>
                  <Text style={[styles.itemDesc, {color: textColor, paddingRight: isDropdown ? 20 : 4}]} numberOfLines={1}>
                    {TableData}
                  </Text>
                  {isDropdown && (
                    <Image
                      source={UIConfig.DropdownIcon}
                      style={{
                        height: 14,
                        width: 14,
                        resizeMode: 'contain',
                        tintColor: '#466DC6',
                        position: 'absolute',
                        right: 2,
                        bottom: 4,
                      }}
                    />
                  )}
                </TouchableOpacity>
              </TouchableOpacity>
            );
          }

          if (tableView === APP_CONST.SPREAD_TYPE_GRID) {
            return (
              <View
                key={itemIndex}
                onLayout={event => {
                  if (index === 0) {
                    const {width} = event.nativeEvent.layout;
                    gridColumnWidths.current[itemIndex] = width;
                  }
                }}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  style={{
                    width: customWidth,
                    padding: 6,
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'row',
                    backgroundColor: isSearchMatch ? '#00d60b81' : isDisabled ? '#dcdcdc98' : isRemarks ? (item[hdr.key] ? '#008080' : '#ef7f11') : lookupBG,
                    borderWidth: StyleSheet.hairlineWidth,
                    borderColor: isRemarks ? '#CCC' : '#000',

                    elevation: isRemarks ? 3 : 0,
                    shadowColor: '#000',
                    shadowOffset: {width: 0, height: 2},
                    shadowOpacity: isRemarks ? 0.25 : 0,
                    shadowRadius: 3.84,

                    borderBottomLeftRadius: isLastRow && itemIndex == 0 ? 6 : undefined,
                    borderBottomRightRadius: isLastRow && itemIndex == tableHeader.length - 1 ? 6 : undefined,
                  }}
                  onPress={() => {
                    setPressedIndex(index);
                    handlePress(item[hdr.key], index, itemIndex);
                  }}
                  onLongPress={() => {
                    setTooltipText(TableData);
                    setTooltipVisible(true);
                  }}
                  delayLongPress={200}>
                  {inputVisible == true ? (
                    <TextInput style={styles.gridInputText} onChangeText={value => setCellVal(value)} />
                  ) : (
                    <Text style={[styles.gridButtonText, {color: textColor, paddingRight: isDropdown ? 10 : 0}]} numberOfLines={1}>
                      {TableData}
                    </Text>
                  )}
                  {isDropdown && (
                    <Image
                      source={UIConfig.DropdownIcon}
                      style={{
                        height: 14,
                        width: 14,
                        resizeMode: 'contain',
                        tintColor: '#466DC6',
                        position: 'absolute',
                        right: 10,
                      }}
                    />
                  )}
                </TouchableOpacity>
              </View>
            );
          }
        })}
      </View>
    );
  };

  function editCellValue(newValue: any = null): void {
    // For Column Widths
    if (configType == TableInputConfig.COLWIDTH) {
      setColWidths(prevWidths => {
        const exists = prevWidths.find(col => col.index === cellCol);

        if (exists) {
          return prevWidths.map(col => (col.index === cellCol ? {...col, width: cellVal} : col));
        } else {
          return [...prevWidths, {index: cellCol, width: cellVal}];
        }
      });

      setCellCol(undefined);
      setCellVal(undefined);
      setModalVisible(false);
      return;
    }

    // For Table Values
    const updatedItems = [...tableData];

    if (cellRow && cellCol) {
      const colKey = Object.keys(updatedItems[cellRow])[cellCol];
      const editFormat = NmGetEditFormat(configType, cellVal);

      if (configType == TableInputConfig.LOOKUP) {
        const colNames = activeInputConfig?.lookupCols || Object.keys(newValue)[0]; // Fallback value (get the first column from the lookup window)
        const colIndex = activeInputConfig?.doneIndex || [cellCol]; // Fallback value (show selected value on current column)

        if (colNames?.length == colIndex?.length) {
          // if both lookupCols and doneIndex props are supplied equally
          for (let index = 0; index < colNames.length; index++) {
            const custColumnKey = Object.keys(updatedItems[cellRow])[colIndex[index]];
            updatedItems[cellRow][custColumnKey] = newValue[colNames[index]];
          }
        } else {
          // Get the lowest count out of lookupCols and doneIndex if they are not equal
          const minLength = Math.min(colNames?.length, colIndex?.length);

          for (let index = 0; index < minLength; index++) {
            const custColumnKey = Object.keys(updatedItems[cellRow])[colIndex[index]];
            updatedItems[cellRow][custColumnKey] = newValue[colNames[index]];
          }
        }
      } else {
        updatedItems[cellRow][colKey] = newValue ?? editFormat;
      }
    }

    setItems?.(updatedItems);

    setCellCol(undefined);
    setCellRow(undefined);
    setCellVal(undefined);
    setModalVisible(false);
  }

  // ========== ADD/COPY/DELETE ROWS Function ========== //

  const handleAddRow = (): void => {
    const template = tableData.length > 0 ? tableData[0] : {};
    const newRow: {[key: string]: any} = {};
    Object.keys(template).forEach(key => (newRow[key] = ''));

    const tableDataCopy = [...tableData];
    if (pressedIndex >= 0) {
      tableDataCopy.splice(pressedIndex + 1, 0, newRow);
    } else {
      tableDataCopy.push(newRow);
    }

    setItems?.(tableDataCopy);
  };

  const handleCopyRow = (): void => {
    if (pressedIndex < 0) {
      setTooltipText('Please select a row to copy');
      setTooltipVisible(true);
    } else {
      const selectedRow = {...tableData[pressedIndex]};
      const tableDataCopy = [...tableData];

      tableDataCopy.splice(pressedIndex + 1, 0, selectedRow);
      setItems?.(tableDataCopy);
      setPressedIndex(-1);
    }
  };

  const handleDeleteRow = (): void => {
    let targetIndex = pressedIndex;

    if (targetIndex < 0 && autoDeleteLastRow) {
      targetIndex = tableData.length - 1;
    }

    if (targetIndex < 0) {
      setTooltipText('Please select a row to delete');
      setTooltipVisible(true);
      return;
    }

    if (tableData.length <= 1) {
      const template = tableData[0] || {};
      const clearedRow: {[key: string]: any} = {};
      Object.keys(template).forEach(key => (clearedRow[key] = ''));
      setItems?.([clearedRow]);
    } else {
      const updatedData = tableData.filter((_, i) => i !== targetIndex);
      setItems?.(updatedData);
    }

    setPressedIndex(-1);
  };

  const handleSearch = (): void => {
    const query = searchValue.toLowerCase().trim();
    if (!query) {
      setMatchIndices([]);
      setCurrentMatchPointer(-1);
      return;
    }

    const allMatches: {rowIndex: number; colIndex: number}[] = [];
    tableData.forEach((row, rowIndex) => {
      tableHeader.forEach((hdr, colIndex) => {
        const rawValue = row[hdr.key];
        const rawString = String(rawValue || '').toLowerCase();

        const inputConfig = inputMap[hdr.index];
        const displayString = String(NmGetDisplayFormat(inputConfig?.type, rawValue, inputConfig?.data) || '').toLowerCase();

        if (rawString.includes(query) || displayString.includes(query)) {
          allMatches.push({rowIndex, colIndex});
        }
      });
    });

    if (allMatches.length === 0) {
      setMatchIndices([]);
      setCurrentMatchPointer(-1);
      setTooltipText('No matches found');
      setTooltipVisible(true);
      return;
    }

    let nextPointer = 0;
    const isSameSearch = matchIndices.length === allMatches.length && matchIndices[0]?.rowIndex === allMatches[0]?.rowIndex && matchIndices[0]?.colIndex === allMatches[0]?.colIndex;

    if (isSameSearch) {
      nextPointer = (currentMatchPointer + 1) % allMatches.length;
    } else {
      nextPointer = 0;
    }

    const {rowIndex: targetRow, colIndex: targetCol} = allMatches[nextPointer];

    setMatchIndices(allMatches);
    setCurrentMatchPointer(nextPointer);
    setPressedIndex(targetRow);

    const activeRef = tableView === APP_CONST.SPREAD_TYPE_LIST ? listRef : gridRef;
    const rowHeight = listItemHeight.current || 60;

    activeRef.current?.scrollToOffset({
      offset: rowHeight * targetRow,
      animated: true,
    });

    if (tableView === APP_CONST.SPREAD_TYPE_GRID && horizontalScrollViewRef.current) {
      let xOffset = 0;
      for (let i = 0; i < targetCol; i++) {
        xOffset += gridColumnWidths.current[i] || 0;
      }

      horizontalScrollViewRef.current.scrollTo({
        x: xOffset,
        y: 0,
        animated: true,
      });
    }
  };

  return (
    <View style={[styles.container, style]} onBlur={() => setPressedIndex(-1)}>
      <NmTableEditModal
        isVisible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setCellVal(null);
        }}
        onSave={() => editCellValue()}
        value={cellVal}
        setValue={setCellVal}
        columnName={tableHeader[cellCol ?? -1]?.name}
        inputConfig={activeInputConfig}
      />

      <NmLookupModal
        queryID={queryID}
        isVisible={modalLookupVisible}
        onClose={() => setModalLookupVisible(false)}
        onSelect={item => {
          editCellValue(item);
        }}
      />

      {/* <NmModalWebViewer /> */}

      <NmModalRemarks visible={showRemarks} setVisible={setShowRemarks} textValue={cellVal} setTextValue={value => editCellValue(value)} />

      <NmToastModal toastVisible={tooltipVisible} setToastVisible={setTooltipVisible} text={tooltipText} hideDelay={tooltipHideDelay} />

      <ScrollView horizontal={true}>
        <View style={{flexDirection: 'row', alignItems: 'center', paddingBottom: 10, padding: 2, backgroundColor: theme.backgroundColor}}>
          {changeViewButton && (
            <TouchableOpacity
              style={{flexDirection: 'row', height: 36, alignItems: 'center', backgroundColor: theme.buttonColor, borderRadius: 6, paddingHorizontal: 8, marginLeft: 4}}
              onPress={() => {
                setTableView(tableView == APP_CONST.SPREAD_TYPE_GRID ? APP_CONST.SPREAD_TYPE_LIST : APP_CONST.SPREAD_TYPE_GRID);
              }}>
              <MaterialCommunityIcons name={tableView == APP_CONST.SPREAD_TYPE_GRID ? 'view-list-outline' : 'view-comfy-outline'} size={24} color={'#FFF'} />
            </TouchableOpacity>
          )}

          {addRowButton && (
            <TouchableOpacity
              style={{flexDirection: 'row', height: 36, alignItems: 'center', backgroundColor: theme.buttonColor, borderRadius: 6, paddingHorizontal: 8, marginLeft: 4}}
              onPress={handleAddRow}>
              <NmLabel style={{color: '#FFF'}}>{'Insert row'}</NmLabel>
            </TouchableOpacity>
          )}

          {copyRowButton && (
            <TouchableOpacity
              style={{flexDirection: 'row', height: 36, alignItems: 'center', backgroundColor: theme.buttonColor, borderRadius: 6, paddingHorizontal: 8, marginLeft: 4}}
              onPress={handleCopyRow}>
              <NmLabel style={{color: '#FFF'}}>{'Copy row'}</NmLabel>
            </TouchableOpacity>
          )}

          {deleteRowButton && (
            <TouchableOpacity
              style={{flexDirection: 'row', height: 36, alignItems: 'center', backgroundColor: theme.buttonColor, borderRadius: 6, paddingHorizontal: 8, marginLeft: 4}}
              onPress={handleDeleteRow}>
              <NmLabel style={{color: '#FFF'}}>{'Delete row'}</NmLabel>
            </TouchableOpacity>
          )}

          {resetColWidthButton && (
            <TouchableOpacity
              style={{flexDirection: 'row', height: 36, alignItems: 'center', backgroundColor: theme.buttonColor, borderRadius: 6, paddingHorizontal: 8, marginLeft: 4}}
              onPress={() => {
                const tempWidths = columnWidths || [];
                setColWidths(tempWidths);
              }}>
              <NmLabel style={{color: '#FFF'}}>{'Reset Column Width'}</NmLabel>
            </TouchableOpacity>
          )}

          {showSearch && (
            <View style={{flexDirection: 'row', alignItems: 'center', marginLeft: 4}}>
              <NmTextInput
                containerStyle={{width: WINDOW_WIDTH / 2, height: 38}}
                onChangeText={text => {
                  setSearchValue(text);
                }}
                value={searchValue}
                maxLength={100}
              />
              <TouchableOpacity
                style={{flexDirection: 'row', height: 36, alignItems: 'center', backgroundColor: theme.buttonColor, borderRadius: 6, paddingHorizontal: 8, marginLeft: 4}}
                onPress={() => {
                  //console.log('searchValue', searchValue);
                  handleSearch();
                }}>
                <NmLabel style={{color: '#FFF'}}>{'Find'}</NmLabel>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>

      {tableView == APP_CONST.SPREAD_TYPE_LIST && <FlatList ref={listRef} data={tableData} renderItem={renderRow} nestedScrollEnabled={true} />}

      {tableView == APP_CONST.SPREAD_TYPE_GRID && (
        <ScrollView ref={horizontalScrollViewRef} horizontal={true} contentContainerStyle={{flexGrow: 1}}>
          <View style={{}}>
            <View style={{flexDirection: 'row'}}>{tableHeader?.length > 0 && tableHeader.map((header, index) => renderHeader({item: header, index}))}</View>

            <FlatList
              ref={gridRef}
              data={tableData}
              renderItem={renderRow}
              nestedScrollEnabled={true}
              contentContainerStyle={{flexGrow: 1, marginTop: 0}}
              keyExtractor={(item, index) => 'grid-' + index}
            />
          </View>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF',
    paddingBottom: 10,
  },
  modalContainer: {
    width: '95%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 6,
    overflow: 'hidden',
  },
  buttonStyle: {
    borderRadius: 6,
    width: '100%',
    height: 32,
    backgroundColor: '#2E7FF9',
  },
  buttonTextStyle: {
    fontFamily: 'Poppins-Regular',
    fontSize: 15,
    color: 'white',
  },
  gridColumnTitle: {
    fontFamily: 'Poppins-Regular',
    color: '#000',
    fontSize: 14,
  },
  gridButton: {
    alignItems: 'center',
    backgroundColor: '#2E7FF9',
    width: '100%',
    borderRadius: 0,
  },
  gridButtonText: {
    fontFamily: 'Poppins-Regular',
    color: '#000',
    fontSize: 14,
    lineHeight: 19,
  },
  gridInputText: {
    fontFamily: 'Poppins-Regular',
    color: '#000',
    fontSize: 14,
    padding: 0,
  },
  itemName: {
    fontFamily: 'Poppins-Regular',
    color: '#848484',
    fontSize: 15,
  },
  itemDesc: {
    fontFamily: 'Poppins-Bold',
    color: '#000',
    fontSize: 15,
    lineHeight: 25,
  },
  textInputStyle: {
    paddingVertical: 0,
    paddingLeft: 10,
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    flex: 1,
    color: '#000',
    textAlignVertical: 'center',
    paddingHorizontal: 10,
  },
  modalTitle: {
    color: '#FFF',
    fontFamily: 'Poppins-Regular',
    fontSize: 18,
    marginLeft: 10,
    marginTop: 5,
  },
  modalbuttonStyle: {
    height: 36,
    flex: 1,
    backgroundColor: '#1974D1',
    marginHorizontal: 5,
    borderRadius: 6,
  },
  modalButtonTextStyle: {
    color: '#FFF',
    fontFamily: 'Poppins-Regular',
    fontSize: 18,
  },
  textInputContainer: {
    height: 45,
    width: '100%',
    borderWidth: 1,
    borderColor: '#E0DFE4',
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    //borderColor: '#bec8d9',
  },
  header: {
    height: 40,
    backgroundColor: '#1974D1',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  closeIcon: {
    resizeMode: 'contain',
    height: 26,
    width: 26,
  },
  contentBody: {
    backgroundColor: '#FFF',
    padding: 15,
  },
  inputWrapper: {
    height: 45,
    borderWidth: 1,
    borderColor: '#E0DFE4',
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  pickerTrigger: {
    flex: 1,
    paddingHorizontal: 10,
    justifyContent: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
});

export default NmTable;
