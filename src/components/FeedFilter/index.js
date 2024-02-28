import { useCallback, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { filterOptions } from "../../constants/filter-options";
import { validRoutes } from "../../constants/valid-routes";
import { Switcher } from "../Switcher";

export function FeedFilter({ selectedMode }) {
  const history = useHistory();

  const [selectedOption, setSelectedOption] = useState(0);

  const checkWhichOptionIsSelected = useCallback(() => {
    if (history.location.pathname.indexOf(validRoutes.FILTER_FOLLOWING) > -1) {
      selectedMode(filterOptions[1].value);
      setSelectedOption(1);

      return;
    }

    selectedMode(filterOptions[0].value);
    setSelectedOption(0);
  }, [history.location.pathname, selectedMode]);

  useEffect(() => {
    checkWhichOptionIsSelected();
  }, [checkWhichOptionIsSelected]);

  function handleOnChangeSwitcher(selectedSwitcherOption) {
    history.push(selectedSwitcherOption);
    checkWhichOptionIsSelected();
  }

  return (
    <Switcher
      options={filterOptions}
      optionChecked={selectedOption}
      onChange={handleOnChangeSwitcher}
    />
  );
}
