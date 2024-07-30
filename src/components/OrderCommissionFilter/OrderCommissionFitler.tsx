import { useCallback, useState } from "react";
import { ChoiceList, DatePicker, IndexFilters, IndexFiltersProps, TabProps, useSetIndexFiltersMode } from "@shopify/polaris"
import { OrderCommissionType } from "../../types/orderCommion";

const sleep = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));


// props type
interface PropType {
    orders? : OrderCommissionType[];
    customerList : { label: string, value : string }[]
    selectedCustomers : string[] | undefined
    setSelectedCustomers : React.Dispatch<React.SetStateAction<string[] | undefined>>
    attributedStaffNameList : { label: string, value : string }[]
    selectedAttributedStaffName : string[] | undefined
    setSelectedAttributedStaffName : React.Dispatch<React.SetStateAction<string[] | undefined>>
    orderMonth : number
    orderYear : number
    setSelectedDates : any
    selectedDates : any
    setDate : any
}

const OrderCommissionFitler = ({ customerList, selectedCustomers, setSelectedCustomers,attributedStaffNameList, 
    selectedAttributedStaffName, setSelectedAttributedStaffName, orderMonth, orderYear,selectedDates, setSelectedDates, setDate } : PropType) => {

    const [queryValue, setQueryValue] = useState('');
    const [itemStrings, setItemStrings] = useState<string[]>(['All']);
    const [selected, setSelected] = useState(0);
    const { mode, setMode } = useSetIndexFiltersMode();

    const [accountStatus, setAccountStatus] = useState<string[] | undefined>(
      undefined,
    );

    const onHandleSave = async () => {
        await sleep(1);
        return true;
    };

    const onHandleCancel = () => {};

    const onCreateNewView = async (value: string) => {
      await sleep(500);
      setItemStrings([...itemStrings, value]);
      setSelected(itemStrings.length);
      return true;
    };

    const duplicateView = async (name: string) => {
        setItemStrings([...itemStrings, name]);
        setSelected(itemStrings.length);
        await sleep(1);
        return true;
    };

    const deleteView = (index: number) => {
        const newItemStrings = [...itemStrings];
        newItemStrings.splice(index, 1);
        setItemStrings(newItemStrings);
        setSelected(0);
    };

    const handleCustomerChange = useCallback((value: string[]) => {
        setSelectedCustomers(value)
    },[]);
    
    const handleAttributedStaffNameChange = useCallback((value: string[]) => {
        setSelectedAttributedStaffName(value)
    },[]);

    const handleDateRangeChange = useCallback((month: number, year: number) => {
        console.log(month, year)
        setDate({month, year})
    },[]);


    const handleCustomerRemove = useCallback(
        () => setSelectedCustomers(undefined),
    [],
    );

    const handleAttributeStaffRemove = useCallback(
        () => setSelectedAttributedStaffName(undefined),
    [],
    );

    const handleDateRangeRemove = useCallback(
        () => setSelectedDates({
            start: new Date(new Date().setDate(new Date().getDate() - 30)), // Default to 30 days ago
            end: new Date(),
          }),
    [],
    );

    const handleAccountStatusRemove = useCallback(
        () => setAccountStatus(undefined),
    [],
    );
    

    const primaryAction: IndexFiltersProps['primaryAction'] =
    selected === 0
      ? {
          type: 'save-as',
          onAction: onCreateNewView,
          disabled: false,
          loading: false,
        }
      : {
          type: 'save',
          onAction: onHandleSave,
          disabled: false,
          loading: false,
    };
    
  const handleFiltersQueryChange = useCallback(
    (value: string) => setQueryValue(value),
    [],
  );

  const tabs: TabProps[] = itemStrings.map((item, index) => ({
    content: item,
    index,
    onAction: () => {},
    id: `${item}-${index}`,
    isLocked: index === 0,
    actions:
      index === 0
        ? []
        : [
            {
              type: 'rename',
              onAction: () => {},
              onPrimaryAction: async (value: string): Promise<boolean> => {
                const newItemsStrings = tabs.map((item, idx) => {
                  if (idx === index) {
                    return value;
                  }
                  return item.content;
                });
                await sleep(1);
                setItemStrings(newItemsStrings);
                return true;
              },
            },
            {
              type: 'duplicate',
              onPrimaryAction: async (value: string): Promise<boolean> => {
                await sleep(1);
                duplicateView(value);
                return true;
              },
            },
            {
              type: 'edit',
            },
            {
              type: 'delete',
              onPrimaryAction: async () => {
                await sleep(1);
                deleteView(index);
                return true;
              },
            },
          ],
  }));

  const handleQueryValueRemove = useCallback(() => setQueryValue(''), []);

  const handleFiltersClearAll = useCallback(() => {
    handleCustomerRemove()
    handleAttributeStaffRemove()
    handleDateRangeRemove()
    handleAccountStatusRemove();
    handleQueryValueRemove();
  }, [
    handleCustomerRemove,
    handleAttributeStaffRemove,
    handleDateRangeRemove,
    handleAccountStatusRemove,
    handleQueryValueRemove,
  ]);

  
  const filters = [
    {
      key: 'customerName',
      label: 'Customer name',
      filter: (
        <ChoiceList
          title="Customer name"
          titleHidden
          choices={[ ...customerList ]}
          selected={selectedCustomers || []}
          onChange={handleCustomerChange}
          allowMultiple
        />
      ),
      shortcut: true,
    },
    {
      key: 'attributedStaffName',
      label: 'Attribute Staff',
      filter: (
        <ChoiceList
          title="Attribute Staff"
          titleHidden
          choices={[ ...attributedStaffNameList ]}
          selected={selectedAttributedStaffName || []}
          onChange={handleAttributedStaffNameChange}
          allowMultiple
        />
      ),
      shortcut: true,
    },
    {
      key: 'orderDate',
      label: 'Order Date',
      filter: (
        <DatePicker
            month={orderMonth}
            year={orderYear}
            onChange={setSelectedDates}
            onMonthChange={handleDateRangeChange}
            selected={selectedDates}
            allowRange
        />
      ),
      shortcut: true,
    },
  ];


  const appliedFilters: IndexFiltersProps['appliedFilters'] = [];

  console.log({ selectedDates })

  if (selectedCustomers && !isEmpty(selectedCustomers)) {
    const key = 'customerName';
    appliedFilters.push({
      key,
      label: disambiguateLabel(key, selectedCustomers),
      onRemove: handleCustomerRemove,
    });
  }

  if (selectedAttributedStaffName && !isEmpty(selectedAttributedStaffName)) {
    const key = 'attributedStaffName';
    appliedFilters.push({
      key,
      label: disambiguateLabel(key, selectedAttributedStaffName),
      onRemove: handleAttributeStaffRemove,
    });
  }

  if (selectedDates && !isEmpty(selectedDates)) {
    const key = 'orderDate';
    appliedFilters.push({
      key,
      label: disambiguateLabel(key, selectedDates),
      onRemove: handleDateRangeRemove,
    });
  }

  return (
    <>
        <IndexFilters
            queryValue={queryValue}
            queryPlaceholder="Searching in all"
            onQueryChange={handleFiltersQueryChange}
            onQueryClear={() => setQueryValue('')}
            primaryAction={primaryAction}
            cancelAction={{
            onAction: onHandleCancel,
            disabled: false,
            loading: false,
            }}
            tabs={tabs}
            selected={selected}
            onSelect={setSelected}
            canCreateNewView
            onCreateNewView={onCreateNewView}
            filters={filters}
            appliedFilters={appliedFilters}
            onClearAll={handleFiltersClearAll}
            mode={mode}
            setMode={setMode}
        />
    </>
  )
}

export default OrderCommissionFitler


function disambiguateLabel(key: string, value: string | any[] | any): string {
    switch (key) {
      case 'customerName':
        return 'customers : ' +(value as string[]).map((val) => ` ${val}`).join(', ');
      case 'attributedStaffName':
        return 'attributedStaffs' + (value as string[]).map((val) => ` ${val}`).join(', ');
      case 'orderDate':
        return 'start date : ' + `${new Date(value.start).toDateString()}` + ' , ' + 'end date : ' + `${new Date(value.end).toDateString()}`;
      default:
        return value as string;
    }
  }

  function isEmpty(value: string | string[]): boolean {
    if (Array.isArray(value)) {
      return value.length === 0;
    } else {
      return value === '' || value == null;
    }
}
