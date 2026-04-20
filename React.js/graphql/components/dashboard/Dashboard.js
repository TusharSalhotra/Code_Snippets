import React, { useState, useEffect } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import Masonry from 'react-masonry-component';
import { useQuery } from '@apollo/react-hooks';
import moment from 'moment-timezone';
import DateTimePicker from 'react-datetime-picker';
import colors from '../../styles/colors';
import CouponRedemptionCard from '../CouponRedemptionCard';
import CreditRedeemedCard from '../CreditRedeemedCard';
import CreditGrantedCard from '../CreditGrantedCard';
import CouponsGrantedCard from '../CouponsGrantedCard';
import ContactsWelcomedCard from '../ContactsWelcomedCard';
import CouponsExpiredCard from '../CouponsExpiredCard';
import Container from '../../shared/Container';
import { useMobileMedia } from '../../util/MediaQuery';
import Section, {
  SectionContainer,
  SectionHeader,
  HeaderText,
  Toolbar,
  SectionContent,
} from '../../shared/Section';
import {
  GET_ORGANIZATION_METRICS,
  GET_ORG_TOP_REFERERS,
} from '../../graphql/queries';
import Loader from '../Loader';
import Button from '../Button';
import * as Time from '../../util/Time';
import TopRefs from './TopRefs';
import TopRefsList from './mobile_ui/TopRefsList';

const ToolbarItemText = styled.p`
  margin: ${(props) => props.margin || '0'};
`;

const ToolBarItem = styled.form`
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.2s;
  font-weight: ${(props) => (props.active ? '600' : '500')};
  color: ${(props) => (props.active ? colors.seaGreen : colors.grey3)};
  margin-right: 15px;
  font-size: 1.4rem;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  cursor: pointer;
  width: max-content;
  border-radius: 10px;
  padding: 5px 10px;
  background: ${(props) => (props.active ? 'rgba(26, 188, 156, 0.1)' : null)};
  @media screen and (max-width: 991px) {
    ${(props) => props.headerDirection === 'column' && 'margin-top:10px'};
  }
  @media screen and (max-width: 767px) {
    ${(props) => props.headerDirection === 'column' && 'margin-top:10px'};
    flex-direction: column;
    width: ${(props) => (props.isCustom ? '100%' : null)};
    flex-wrap: wrap;
  }
`;

const GlobalStyle = createGlobalStyle`
.react-calendar{
  color:black;
  font-weight:500;
  font-size: 13px !important;
  font-family:'Poppins', sans-serif !important;
}
  .react-datetime-picker__inputGroup__leadingZero{
  display: inline-block;
  align-items: center;
 }
  .react-datetime-picker__wrapper{
   display:flex;
 }
  .react-datetime-picker__inputGroup__input {
    color: ${(props) => (props.active ? colors.seaGreen : colors.grey3)};
  }
  .react-datetime-picker__wrapper{
    border-radius:8px;
    padding:0 5px;
    @media screen and (max-width:450px){
      width: 170px;
      display: flex;
    }
  }
  .react-datetime-picker__button svg {
   stroke: grey  ;
  }
  .react-datetime-picker__clear-button{
   display:none 
  }
  .react-datetime-picker__inputGroup{
   
    @media screen and (max-width:450px){
      display: flex;
    justify-content:center;
    align-items: center;
    }
   
  }
  .react-calendar__tile--hasActive{
    background: #f0f0f0 !important;
  }
`;

const ActiveSteps = Object.freeze({
  AllTime: 'AllTime',
  Today: 'Today',
  PastWeek: '1W',
  PastMonth: '1M',
  MonthToDate: 'MTD',
  YearToDate: 'YTD',
  PastYear: '1Y',
  DateRange: 'Custom',
});

export default function Dashboard() {
  // 0's signify all time data
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(0);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showCustomRange, setShowCustomRange] = useState(false);
  const [activeStep, setActiveStep] = useState(ActiveSteps.AllTime);
  const isMobile = useMobileMedia();
  const { data, loading } = useQuery(GET_ORGANIZATION_METRICS, {
    fetchPolicy: 'network-only',
    variables: {
      start,
      end,
    },
  });

  const { data: refData, loading: refLoading } = useQuery(GET_ORG_TOP_REFERERS, {
    fetchPolicy: 'network-only',

  });

  useEffect(() => {
    const filterData = sessionStorage.filterData
      ? JSON.parse(sessionStorage.filterData)
      : null;

    if (filterData) {
      const isCustom = filterData.stepName === ActiveSteps.DateRange;

      setActiveStep(filterData.stepName);
      setStart(filterData.startDate);
      setEnd(filterData.endDate);
      setStartDate(
        isCustom ? new Date(filterData.startDate * 1000) : new Date(),
      );
      setEndDate(isCustom ? new Date(filterData.endDate * 1000) : new Date());
      setShowCustomRange(isCustom);
    }
  }, []);

  const toolbarItems = [
    {
      text: 'All Time',
      active: activeStep === ActiveSteps.AllTime,
      onClick: () => {
        setActiveStep(ActiveSteps.AllTime);
        setStart(0);
        setEnd(0);
      },
    },
    {
      text: 'Today',
      active: activeStep === ActiveSteps.Today,
      onClick: () => {
        setActiveStep(ActiveSteps.Today);
        setStart(moment().startOf('day').unix());
        setEnd(moment().endOf('day').unix());
      },
    },
    {
      text: '1W',
      active: activeStep === ActiveSteps.PastWeek,
      onClick: () => {
        setActiveStep(ActiveSteps.PastWeek);
        setStart(moment().endOf('day').unix() - Time.DAY * 7);
        setEnd(moment().endOf('day').unix());
      },
    },
    {
      text: '1M',
      active: activeStep === ActiveSteps.PastMonth,
      onClick: () => {
        setActiveStep(ActiveSteps.PastMonth);
        setStart(moment().endOf('day').unix() - Time.DAY * 30);
        setEnd(moment().endOf('day').unix());
      },
    },
    {
      text: 'MTD',
      active: activeStep === ActiveSteps.MonthToDate,
      onClick: () => {
        setActiveStep(ActiveSteps.MonthToDate);
        setStart(moment().startOf('month').unix());
        setEnd(moment().endOf('day').unix());
      },
    },
    {
      text: 'YTD',
      active: activeStep === ActiveSteps.YearToDate,
      onClick: () => {
        setActiveStep(ActiveSteps.YearToDate);
        setStart(moment().startOf('year').unix());
        setEnd(moment().endOf('day').unix());
      },
    },
    {
      text: '1Y',
      active: activeStep === ActiveSteps.PastYear,
      onClick: () => {
        setActiveStep(ActiveSteps.PastYear);
        setStart(moment().endOf('day').unix() - Time.DAY * 365);
        setEnd(moment().endOf('day').unix());
      },
    },
    {
      text: 'Custom',
      active: activeStep === ActiveSteps.DateRange,
      onClick: () => {
        setShowCustomRange(true);
      },
    },
  ];

  const filterByDateRange = (e) => {
    e.preventDefault();
    if (startDate && endDate) {
      setActiveStep(ActiveSteps.DateRange);
      setStart(moment(startDate).unix());
      setEnd(moment(endDate).unix());
    }
  };

  useEffect(() => {
    const setFilterLocalData = () => {
      sessionStorage.filterData = JSON.stringify({
        stepName: activeStep,
        startDate: start,
        endDate: end,
      });
    };
    setFilterLocalData();
    if (activeStep !== ActiveSteps.DateRange) {
      return setShowCustomRange(false);
    }
    setShowCustomRange(true);
  }, [activeStep, end, start]);

  return (
    <Container>
      <SectionContainer>
        <SectionHeader headerDirection="column">
          <HeaderText>Dashboard</HeaderText>
          <Toolbar>
            <GlobalStyle active={activeStep === ActiveSteps.DateRange} />
            <>
              {toolbarItems.map((item, index) => {
                return (
                  <ToolBarItem
                    active={item.active}
                    onClick={() => item.onClick()}
                    onSubmit={(e) => filterByDateRange(e)}
                    key={index}
                    headerDirection="column"
                    isCustom={item.text === 'Custom' && showCustomRange}
                  >
                    <ToolbarItemText
                      margin={
                        isMobile && showCustomRange && item.text === 'Custom'
                          ? '0 0 10px 0'
                          : (!isMobile && showCustomRange && item.text)
                            === 'Custom'
                            ? '0 10px 0 0'
                            : '0'
                      }
                    >
                      {item.text}
                    </ToolbarItemText>
                    {showCustomRange && item.text === ActiveSteps.DateRange && (
                      <>
                        <DateTimePicker
                          clearIcon={<></>}
                          format="MM-dd-y"
                          disableClock
                          minDate={new Date('2000-01-01')}
                          maxDate={endDate}
                          value={startDate}
                          onChange={(val) => setStartDate(val)}
                          required
                        />
                        <h3
                          style={{
                            margin: '0px 5px',
                            display: 'flex',
                            alignItems: 'center',
                          }}
                        >
                          -
                        </h3>
                        <DateTimePicker
                          format="MM-dd-y"
                          clearIcon={<></>}
                          disableClock
                          minDate={startDate}
                          maxDate={new Date()}
                          value={endDate}
                          onChange={(val) => setEndDate(val)}
                          required
                        />
                        <Button
                          type="submit"
                          width="60px"
                          height="30px"
                          margin={isMobile ? '10px 7px' : '0 7px'}
                          text="Apply"
                        />
                      </>
                    )}
                  </ToolBarItem>
                );
              })}
            </>
          </Toolbar>
        </SectionHeader>

        <SectionContent loading={loading ? '1' : '0'}>
          {loading ? (
            <Loader />
          ) : (
            <div style={{ width: '100%' }}>
              <Masonry options={{ horizontalOrder: true }}>
                <CouponRedemptionCard metrics={data.getOrganizationMetrics} />
                <CreditRedeemedCard metrics={data.getOrganizationMetrics} />
                <CreditGrantedCard metrics={data.getOrganizationMetrics} />
                <CouponsGrantedCard metrics={data.getOrganizationMetrics} />
                <ContactsWelcomedCard metrics={data.getOrganizationMetrics} />
                <CouponsExpiredCard metrics={data.getOrganizationMetrics} />
              </Masonry>
            </div>
          )}
        </SectionContent>
      </SectionContainer>
      <Section headerTitle="Top 10 Referrers" loading={refLoading}>

        {
          isMobile
            ? <TopRefsList contacts={refData?.getOrgTopReferers} />

            : <TopRefs contacts={refData?.getOrgTopReferers} />
        }
      </Section>
    </Container>
  );
}
