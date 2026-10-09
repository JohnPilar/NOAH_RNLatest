import React, {useContext, useState, useEffect} from 'react';
import {View, StyleSheet, TextInput, Text, TouchableOpacity, FlatList, useWindowDimensions} from 'react-native';
import Modal from 'react-native-modal';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import {ThemesContext} from '../functions/ThemeContext';
import {AccountDetailsContext} from '../functions/Contexts';
import {NmTitleCase} from '../functions/NmFunctions';
import {NmLabel} from './NmComponents';
import NmButton from './NmButton';
import {NmColors, NmStyles} from '../constants';
import NmTextInput from './NmTextInput';
import {NmGetMobileData} from '../functions/NmNetwork';
import {LoadingPanel} from './NmLoadingComponents';

interface NmLookupModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSelect: (item: any) => void;
  queryID?: any;
  demoMode?: boolean;
  sampleData?: Array<any>;
  paginated?: boolean;
  numPerPage?: number;
  hideCols?: any;
  showExpand?: boolean;
  iconStyle?: any;
}

export default function NmLookupModal(props: NmLookupModalProps): React.JSX.Element {
  const {isVisible, onClose, onSelect, queryID, demoMode, sampleData, paginated, numPerPage, hideCols, showExpand, iconStyle} = props;
  const {theme} = useContext(ThemesContext);
  const {companyCode} = useContext(AccountDetailsContext);
  const {height} = useWindowDimensions();

  const [searchValue, setSearchValue] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<string>('1');
  const [numPages, setNumPages] = useState<number>(0);
  const [dataOriginal, setDataOriginal] = useState<any[]>([]);
  const [dataSource, setDataSource] = useState<any[]>([]);
  const [dataCount, setDataCount] = useState<number>(0);
  const [navPrevDisabled, setNavPrevDisabled] = useState<boolean>(false);
  const [navNextDisabled, setNavNextDisabled] = useState<boolean>(false);

  const numRecordsPerPage = numPerPage == undefined ? 10 : numPerPage;

  useEffect(() => {
    if (isVisible && !demoMode) {
      setLoading(true);
      NmGetMobileData({qid: queryID, _compcode: companyCode}).then(response => {
        if (response?.status == '200') {
          setDataSource(response.data.data);
          setDataOriginal(response.data.data);
        }
        setLoading(false);
      });
    }

    if (!isVisible) {
      setSearchValue('');
      if (queryID) {
        setLoading(true);
        setDataCount(0);
        setDataSource([]);
        setDataOriginal([]);
      }
    }
  }, [isVisible]);

  useEffect(() => {
    if (demoMode) {
      setDataSource(sampleData ?? []);
      setDataOriginal(sampleData ?? []);
      setLoading(false);
    }
  }, [demoMode]);

  useEffect(() => {
    if (paginated == true && dataSource?.length > 0) {
      setNumPages(Math.ceil(dataSource?.length / numRecordsPerPage));
      setDataSource(dataSource.slice(0, numRecordsPerPage));
    }
  }, [paginated, dataSource]);

  useEffect(() => {
    if (dataSource?.length >= 0) {
      setDataCount(dataSource.length);
    }
  }, [dataSource]);

  useEffect(() => {
    if (currentPage == '1') {
      setNavPrevDisabled(true);
    } else {
      setNavPrevDisabled(false);
    }

    if (currentPage == numPages.toString()) {
      setNavNextDisabled(true);
    } else {
      setNavNextDisabled(false);
    }

    const tmpPage = parseInt(currentPage);
    if (dataOriginal.length > 0) {
      setDataSource(dataOriginal.slice(tmpPage * numRecordsPerPage - numRecordsPerPage, tmpPage * numRecordsPerPage));
    }
  }, [currentPage]);

  function updatePage(action: string): void {
    let tmpPage = parseInt(currentPage);
    if (action == 'NEXT' && tmpPage != numPages) {
      tmpPage += 1;
    } else if (action == 'PREV' && tmpPage != 1) {
      tmpPage -= 1;
    }
    setCurrentPage(tmpPage.toString());
  }

  const handleSearch = (): void => {
    setLoading(true);
    const formattedQuery = searchValue.toLowerCase();
    const filteredData = dataOriginal.filter(item => {
      return Object.values(item).some(value => String(value).toLowerCase().includes(formattedQuery));
    });
    setDataSource(filteredData);
    setLoading(false);
  };

  const handleSelect = React.useCallback(
    (item: any): void => {
      onSelect(item);
      onClose();
    },
    [onSelect, onClose],
  );

  const renderItem = React.useCallback(
    ({item, index}: {item: any; index: number}): React.JSX.Element => <LookUpItem item={item} hideCols={hideCols} showExpand={showExpand} theme={theme} handleSelect={handleSelect} />,
    [theme, hideCols, showExpand, handleSelect],
  );

  return (
    <Modal
      propagateSwipe={true}
      isVisible={isVisible}
      backdropOpacity={0.4}
      onBackdropPress={onClose}
      style={[{alignItems: 'center', justifyContent: 'center', margin: 0, width: '100%', paddingHorizontal: 6}]}
      animationIn="slideInRight"
      animationOut="slideOutLeft"
      backdropTransitionOutTiming={0}
      onBackButtonPress={onClose}>
      <View style={{width: '100%', maxHeight: height * 0.9, alignItems: 'center', backgroundColor: theme.lookupWindowBackground, borderRadius: 6, overflow: 'hidden'}}>
        <View style={{width: '100%'}}>
          {loading && <LoadingPanel />}
          <View
            style={{
              height: 46,
              backgroundColor: theme.lookupWindowHeader,
              width: '100%',
              borderTopStartRadius: 6,
              borderTopEndRadius: 6,
              justifyContent: 'space-between',
              alignItems: 'center',
              flexDirection: 'row',
              overflow: 'hidden',
            }}>
            <TouchableOpacity style={{height: '100%', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 12}} onPress={onClose}>
              <MaterialCommunityIcons name={'keyboard-backspace'} size={24} color={'#FFF'} />
            </TouchableOpacity>
            <Text style={[NmStyles.poppinsMedium, {color: '#FFF', marginBottom: -2, paddingRight: 12}]}>{'Look Up'}</Text>
          </View>

          <View style={{padding: 6}}>
            <View style={[styles.lookupTextBox, {borderColor: theme.lookupWindowSearchBorder, backgroundColor: theme.lookupWindowSearch}]}>
              <TextInput style={[NmStyles.textInput, {color: theme.lookupWindowSearchText}]} onChangeText={value => setSearchValue(value)} value={searchValue} />
              <TouchableOpacity onPress={handleSearch} activeOpacity={0.6} style={[styles.lookupButtonStyle, {backgroundColor: theme.lookupWindowSearchButton}]}>
                <MaterialCommunityIcons name={'magnify'} size={24} color={'#FFF'} />
              </TouchableOpacity>
            </View>
          </View>

          {dataSource != undefined && dataSource.length > 0 ? (
            <View style={{maxHeight: height * 0.6, paddingHorizontal: 6, paddingBottom: 8}}>
              <FlatList
                data={dataSource}
                extraData={theme}
                renderItem={renderItem}
                keyExtractor={(value, index) => index.toString()}
                contentContainerStyle={{flexGrow: 0, borderRadius: 6, overflow: 'hidden'}}
              />
            </View>
          ) : (
            <View style={{alignItems: 'center', justifyContent: 'center', paddingVertical: 40}}>
              <NmLabel style={[NmStyles.poppinsBold, {color: '#AAA', fontSize: 18}]}>{'No Data'}</NmLabel>
            </View>
          )}
          <View style={{paddingBottom: 8, paddingHorizontal: 6}}>
            {paginated == true && (
              <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 45}}>
                <TouchableOpacity disabled={navPrevDisabled} onPress={() => setCurrentPage('1')}>
                  <View style={{flexDirection: 'row'}}>
                    <MaterialIcons name={'navigate-before'} size={28} color={navPrevDisabled ? NmColors.buttonDisabled : theme.lookupWindowPageButton} />
                    <MaterialIcons name={'navigate-before'} size={28} color={navPrevDisabled ? NmColors.buttonDisabled : theme.lookupWindowPageButton} style={{marginLeft: -20}} />
                  </View>
                </TouchableOpacity>
                <TouchableOpacity disabled={navPrevDisabled} onPress={() => updatePage('PREV')}>
                  <MaterialIcons name={'navigate-before'} size={28} color={navPrevDisabled ? NmColors.buttonDisabled : theme.lookupWindowPageButton} style={{marginLeft: 6}} />
                </TouchableOpacity>
                <NmLabel style={{marginBottom: -2, marginLeft: 12}}>{'Page'}</NmLabel>
                <NmTextInput
                  value={currentPage}
                  onChangeText={val => setCurrentPage(val)}
                  containerStyle={{width: undefined, minWidth: 40, height: 30, marginLeft: 12}}
                  textInputStyle={{paddingLeft: 0}}
                  textAlign={'center'}
                  onSubmitEditing={() => {
                    if (currentPage == '' || parseInt(currentPage) > numPages) {
                      setCurrentPage('1');
                    }
                  }}
                />
                <NmLabel style={{marginBottom: -2, marginLeft: 12}}>{'of ' + numPages}</NmLabel>
                <TouchableOpacity disabled={navNextDisabled} onPress={() => updatePage('NEXT')}>
                  <MaterialIcons name={'navigate-next'} size={28} color={navNextDisabled ? NmColors.buttonDisabled : theme.lookupWindowPageButton} style={{marginLeft: 10, marginRight: 6}} />
                </TouchableOpacity>
                <TouchableOpacity disabled={navNextDisabled} onPress={() => setCurrentPage(numPages.toString())}>
                  <View style={{flexDirection: 'row'}}>
                    <MaterialIcons name={'navigate-next'} size={28} color={navNextDisabled ? NmColors.buttonDisabled : theme.lookupWindowPageButton} />
                    <MaterialIcons name={'navigate-next'} size={28} color={navNextDisabled ? NmColors.buttonDisabled : theme.lookupWindowPageButton} style={{marginLeft: -20}} />
                  </View>
                </TouchableOpacity>
              </View>
            )}
            <NmButton style={{borderRadius: 6}} disabled={true} title={dataCount + ' Record(s) Found'} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

interface ItemRowProps {
  mIndex: number;
  colName: string;
  colVal: any;
}

const ItemRow = (props: ItemRowProps): React.JSX.Element => {
  const {mIndex, colName, colVal} = props;
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

interface LookUpItemProps {
  item: any;
  hideCols?: any;
  showExpand?: boolean;
  theme: any;
  handleSelect: (item: any) => void;
}

const LookUpItem = React.memo((props: LookUpItemProps): React.JSX.Element => {
  const {item, hideCols, showExpand, theme, handleSelect} = props;
  const [showAllCols, setShowAllCols] = useState<boolean>(false);

  return (
    <TouchableOpacity
      style={{width: '100%', marginBottom: 8}}
      onPress={() => {
        handleSelect(item);
      }}
      delayLongPress={300}
      onLongPress={() => {
        if (hideCols?.length > 0 && showExpand == true) {
          setShowAllCols(!showAllCols);
        }
      }}>
      <View
        style={{
          width: '100%',
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: theme.lookupWindowItemBorder,
          backgroundColor: theme.lookupWindowItemBackground,
          borderRadius: 6,
          flexDirection: 'row',
          overflow: 'hidden',
        }}>
        <View style={{flex: 1, width: '100%', padding: 6, paddingTop: 8, paddingLeft: 8}}>
          {Object.keys(item).map((key, index) => {
            if (hideCols?.length > 0 && hideCols.includes(key.toString().toLowerCase())) {
              return showAllCols && <ItemRow key={index} mIndex={index} colName={NmTitleCase(key)} colVal={item[key]} />;
            } else {
              return <ItemRow key={index} mIndex={index} colName={NmTitleCase(key)} colVal={item[key]} />;
            }
          })}
        </View>
      </View>
    </TouchableOpacity>
  );
});

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
  lookupButtonStyle: {
    width: 38,
    height: 38,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 2,
  },
});
