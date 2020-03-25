import React, { useEffect } from "react";
import styled from "styled-components";
import { Route, useLocation, useHistory } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import Helmet from "react-helmet";
import { useSwipeable } from "react-swipeable";

import Navigator from "../Navigator";
import { ChapterStore } from "../../store/chapter";
import { RootState } from "../../store/reducers";

export interface Chapter {
  component: React.ReactNode;
  title: string;
  url: string;
}
interface ChaptersProps {
  chapters: Chapter[];
}
function Chapters({ chapters }: ChaptersProps) {
  const location = useLocation();
  const history = useHistory();
  const dispatch = useDispatch();
  const currentChapter = useSelector(
    (state: RootState) => state.Chapter.chapter
  );

  const swipeableHandler = useSwipeable({
    onSwipedLeft: () => {
      currentChapter + 1 < chapters.length &&
        history.push(chapters[currentChapter + 1].url);
    },
    onSwipedRight: () => {
      currentChapter - 1 >= 0 && history.push(chapters[currentChapter - 1].url);
    }
  });

  useEffect(() => {
    chapters.forEach((chapter, i) => {
      if (chapter.url === location.pathname) {
        dispatch(ChapterStore.chapterChange(i));
      }
    });
  }, [location, chapters, dispatch]);
  return (
    <ChaptersWrap {...swipeableHandler}>
      {chapters.map((chapter, i) => (
        <Route path={chapter.url} exact key={i}>
          <Helmet>
            <meta charSet="utf-8" />
            <title>{chapter.title}: EDCAN</title>
          </Helmet>
          {chapter.component}
        </Route>
      ))}
      <Navigator chapters={chapters} />
    </ChaptersWrap>
  );
}
const ChaptersWrap = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

export default Chapters;
