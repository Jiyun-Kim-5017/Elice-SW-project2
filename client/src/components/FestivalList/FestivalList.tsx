import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Container, FestivalInfo, ModalCard } from "./FestivalListStyle";
import { mockData } from "./mockData";
import axios from "axios";

interface Item {
  addr1: string;
  addr2: string;
  booktour: string;
  cat1: string;
  cat2: string;
  cat3: string;
  contentid: string;
  contenttypeid: string;
  createdtime: string;
  eventstartdate: string;
  eventenddate: string;
  firstimage: string;
  firstimage2: string;
  mapx: string;
  mapy: string;
  mlevel: string;
  modifiedtime: string;
  readcount: number;
  areacode: string;
  sigungucode: string;
  tel: string;
  title: string;
}

interface ItemObj {
  item: Item;
  idx: number;
}

interface PageProps {
  location: string;
}

const FestivalList: React.FC<PageProps> = ({ location }) => {
  const [festivalInfo, setFestivalInfo] = useState<Item[]>([]);
  const [festivalModal, setFestivalModal] = useState<boolean[]>(
    new Array(20).fill(false),
  );
  const home = location === "home";
  const date = new Date();
  const eventStartDate = `${date.getFullYear()}${date.getMonth() + 1}01`;
  const serviceKey =
    "7vK0Tt5CPNrirky41NfjhrXhOVngGJ0McJjDrgASEMepGMEtUXEP1%2Fy2wlH6mAUF4U%2FJAUtS0xsaYjtn3NLGgA%3D%3D";

  useEffect(() => {
    // const getData = async () => {
    //   const response = await axios.get(`http://apis.data.go.kr/B551011/KorService/searchFestival?numOfRows={home ? 8 : 20}&pageNo=1&MobileOS=ETC&MobileApp=AppTest&arrange=C&_type=json&serviceKey=${serviceKey}&eventStartDate=${eventStartDate}`)
    // }
    mockData.sort((a, b) => {
      return Number(a.eventstartdate) - Number(b.eventstartdate);
    });
    home ? setFestivalInfo(mockData.slice(0, 8)) : setFestivalInfo(mockData); //찐데이터로 받을 때 수정해야할 식
  }, [home]);

  const dateFormat = (date: string) => {
    return date.slice(0, 4) + "." + date.slice(4, 6) + "." + date.slice(6, 8);
  };

  const onModal = (idx: number) => {
    const newFestivalModal = [...festivalModal];
    newFestivalModal[idx] = true;
    setFestivalModal(newFestivalModal);
  };

  const InfoModal: React.FC<ItemObj> = ({ item, idx }) => {
    return (
      <ModalCard>
        <div className="modalCard">
          <img
            className="closeModal"
            src="https://res.cloudinary.com/dk9scwone/image/upload/v1671625307/free-icon-cancel-8532370_kuiqk1.png"
            onClick={(e) => {
              e.stopPropagation();
              setFestivalModal(new Array(20).fill(false));
            }}
          />

          <img src={item.firstimage} className="festivalImg" />
          <div className="info">
            <div className="festivalTitle">{item.title}</div>
            <div className="festivalDate">
              {dateFormat(item.eventstartdate)}~{dateFormat(item.eventenddate)}
            </div>
            <div className="address">{item.addr1}</div>
            <div className="tel">{item.tel}</div>
          </div>
        </div>
      </ModalCard>
    );
  };

  return (
    <Container>
      <div className="title">
        <h3>축제정보</h3>
        {location === "home" ? <Link to="/festival">더보기</Link> : false}
      </div>
      <FestivalInfo>
        {festivalInfo &&
          festivalInfo.map((item, idx) => {
            return (
              <div
                className="item"
                key={item.contentid}
                onClick={() => {
                  onModal(idx);
                }}
              >
                <img src={item.firstimage} />
                <div className="itemTitle">{item.title}</div>
                <div className="itemDate">
                  {dateFormat(item.eventstartdate)}~
                  {dateFormat(item.eventenddate)}
                </div>
                {festivalModal[idx] && <InfoModal item={item} idx={idx} />}
              </div>
            );
          })}
      </FestivalInfo>
    </Container>
  );
};

export default FestivalList;
