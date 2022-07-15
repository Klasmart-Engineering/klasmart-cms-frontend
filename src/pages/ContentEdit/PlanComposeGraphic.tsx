import { useDndContext, useDraggable, useDroppable } from "@dnd-kit/core";
import { Box, Button, ButtonGroup, Card, CardContent, SvgIconProps, Theme, Typography, useTheme } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import { CancelRounded, Close, DashboardOutlined, Done, FlagOutlined, Spellcheck, SvgIconComponent } from "@mui/icons-material";
import clsx from "clsx";
import { forwardRef, HTMLAttributes, Ref, useCallback, useMemo } from "react";
import { ArcherContainer, ArcherElement, Relation } from "react-archer";
import { NavLink } from "react-router-dom";
import PermissionType from "../../api/PermissionType";
import blankImg from "../../assets/icons/deleted.jpg";
import lessonPlanBgUrl from "../../assets/icons/lesson-plan-bg.svg";
import { Thumbnail } from "../../components/Thumbnail";
import { usePermission } from "../../hooks/usePermission";
import { d } from "../../locale/LocaleManager";
import { ModelLessonPlan, Segment } from "../../models/ModelLessonPlan";

const useStyles = makeStyles(({ palette, shadows, shape, breakpoints }) => ({
  planComposeGraphic: {
    height: 1030,
    display: "flex",
    flexDirection: "column",
    overflow: "scroll",
    [breakpoints.down("md")]: {
      maxHeight: "fit-content",
      overflow: "visible",
    },
  },
  bgImage: {
    background: `url(${lessonPlanBgUrl}) center repeat`,
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: -2,
  },
  arrowSourceCircle: {
    position: "relative",
    "&:after": {
      content: '""',
      display: "block",
      position: "absolute",
      width: 8,
      height: 8,
      bottom: -5,
      left: "50%",
      transform: "translateX(-4px)",
      borderRadius: "100%",
      backgroundColor: palette.grey[700],
    },
  },
  headerTitle: {
    marginRight: 20,
    fontSize: 18,
    fontWeight: "bold",
  },
  conditionBtnUI: {
    display: "flex",
    minWidth: 175,
    paddingRight: 32,
    alignItems: "center",
    borderRadius: 3,
    boxShadow: shadows[3],
    backgroundColor: palette.common.white,
  },
  conditionBtnLabel: {
    whiteSpace: "nowrap",
  },
  headerButtonGroup: {
    position: "absolute",
    top: -46,
    right: 0,
  },
  headerConditionBtn: {
    marginLeft: 40,
    marginTop: 28,
  },
  headerButton: {
    width: 60,
    height: 40,
    backgroundColor: palette.common.white,
    "&.active": {
      color: palette.primary.contrastText,
      backgroundColor: palette.primary.main,
    },
    "&:hover": {
      backgroundColor: palette.action.disabledOpacity,
    },
  },
  blankBox: {
    width: 240,
    height: 160,
    marginTop: 40,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  drappableBox: {
    // padding: 15,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: palette.primary.main,
    borderRadius: shape.borderRadius,
  },
  cardMedia: {
    width: "100%",
    height: 112,
  },
  cardContent: {
    padding: 6,
    "&:last-child": {
      padding: 6,
    },
  },
  removeCardIcon: {
    color: "#d32f2f",
    fontSize: 20,
    backgroundColor: palette.common.white,
    borderRadius: "100%",
    position: "absolute",
    top: -10,
    right: -10,
    display: "none",
  },
}));

const useSegmentComputedStyles = makeStyles({
  segment: (props: SegmentBoxProps) => ({
    // debug
    // backgroundColor: "rgba(0,0,0,.05)",
    paddingTop: props.first ? 0 : 66,
    "&:not(:first-child)": {
      marginLeft: props.first ? 0 : 32,
    },
  }),
  card: (props: SegmentBoxProps) => ({
    // 将来 condition 逻辑要用的， 不要删
    // marginTop: props.first || props.condition ? 40 : props.canDropCondition ? 40 + 59 + 34 : 40 + 59,
    marginTop: props.first ? 40 : 0,
    width: 200,
    position: "relative",
    "&:hover svg": {
      display: "block",
    },
  }),
});

const useGraphicComputedStyles = makeStyles({
  composeArea: (props: Segment) => ({
    // display: "flex",
    // width: "100%",
    // overflowX: "scroll",
    paddingTop: 40,
    paddingBottom: 900,
    // todo: 将来加入了条件，会出现需要左右滚动当场景，需要 justifycontent: start
    // justifyContent: props.material ? "start" : "center",
    // justifyContent: "center",
    position: "relative",
    flexGrow: 1,
  }),
});

type allColorPalette = "primary" | "success" | "error" | "secondary";
interface ConditionBtnUIProps extends HTMLAttributes<HTMLDivElement> {
  color: string;
  label: string;
  Icon: SvgIconComponent;
}
const ConditionBtnUI = forwardRef<HTMLDivElement, ConditionBtnUIProps>((props, ref) => {
  const { color, Icon, label, className, ...restProps } = props;
  const css = useStyles();
  const { palette } = useTheme();
  return (
    <div className={clsx(css.conditionBtnUI, className)} {...restProps} ref={ref}>
      <Box py={2} px={1.5} mr={3} bgcolor={palette[color as unknown as allColorPalette].main} color="white">
        <Icon color="inherit" />
      </Box>
      <Typography className={css.conditionBtnLabel}>{label}</Typography>
    </div>
  );
});

interface ConditionBtnProps extends HTMLAttributes<HTMLDivElement> {
  type: Segment["condition"] | "start";
}
const ConditionBtn = forwardRef<HTMLDivElement, ConditionBtnProps>((props, ref) => {
  const { type, ...restConditionBtnUIProps } = props;
  switch (type) {
    case "start":
      return (
        <ConditionBtnUI
          Icon={FlagOutlined}
          color="primary"
          label={d("Start").t("library_label_start")}
          {...restConditionBtnUIProps}
          ref={ref}
        />
      );
    case "ifCorrect":
      return <ConditionBtnUI Icon={Done} color="success" label="If Correct" {...restConditionBtnUIProps} ref={ref} />;
    case "ifWrong":
      return <ConditionBtnUI Icon={Close} color="error" label="If Wrong" {...restConditionBtnUIProps} ref={ref} />;
    case "ifScoreDown60":
      return <ConditionBtnUI Icon={Spellcheck} color="secondary" label="If Score <&nbsp; 60" {...restConditionBtnUIProps} ref={ref} />;
    case "ifScoreUp60":
      return <ConditionBtnUI Icon={Spellcheck} color="primary" label="If Score >= 60" {...restConditionBtnUIProps} ref={ref} />;
    default:
      return null;
  }
});

export interface DragData {
  type: string;
  item: any;
}
const DraggableConditionBtn = (props: ConditionBtnProps) => {
  const { type } = props;
  // const [, dragRef] = useDrag<DragItem, unknown, unknown>({ item: { type: "condition", data: props.type } });
  const { setNodeRef: dragRef } = useDraggable({ id: `${type}_CONDITION_BUTTON`, data: { type: "condition", data: type } });
  return <ConditionBtn ref={dragRef} {...props} />;
};

interface MaterialCardProps {
  material: Segment["material"];
  onRemove: SvgIconProps["onClick"];
}
const MaterialCard = forwardRef<HTMLDivElement, MaterialCardProps>((props, ref) => {
  const css = useStyles();
  const perms = usePermission([
    PermissionType.edit_lesson_plan_content_238,
    PermissionType.edit_org_published_content_235,
    PermissionType.create_content_page_201,
    PermissionType.create_lesson_plan_221,
  ]);

  const editPlan = perms.edit_lesson_plan_content_238;
  const editAll = perms.edit_org_published_content_235;
  const createAll = perms.create_content_page_201;
  const createplan = perms.create_lesson_plan_221;

  const editable = editPlan || editAll || createAll || createplan;
  if (JSON.stringify(props.material) === "{}" || !props.material) {
    return (
      <Card ref={ref}>
        <img src={blankImg} alt="qq" width={200} height={150} />
        {editable && <CancelRounded onClick={props.onRemove} viewBox="3 3 18 18" className={css.removeCardIcon}></CancelRounded>}
      </Card>
    );
  } else {
    const { onRemove } = props;
    const material = props.material ?? {};
    const { thumbnail, author_name, name, content_type, suggest_time } = material;
    return (
      <Card ref={ref}>
        <Thumbnail className={css.cardMedia} type={content_type} id={thumbnail} />
        <CardContent className={css.cardContent}>
          <Box pr={8} position="relative">
            <Typography component="div" variant="caption" noWrap>
              {name}
            </Typography>
            <Typography component="span" variant="caption" style={{ position: "absolute", right: 0, top: 0 }}>
              ({suggest_time}
              {d("Minutes").t("assess_detail_minutes")})
            </Typography>
          </Box>
          <Typography component="div" variant="caption" color="textSecondary" noWrap>
            {author_name}
          </Typography>
        </CardContent>
        {editable && <CancelRounded onClick={onRemove} viewBox="3 3 18 18" className={css.removeCardIcon}></CancelRounded>}
      </Card>
    );
  }
});

export interface mapDropSegmentPropsReturn {
  canDrop: boolean;
}

interface SegmentBoxProps extends Segment {
  first?: boolean;
  canDropMaterial?: boolean;
  canDropCondition?: boolean;
  plan: Segment;
  onChange: (value: Segment) => any;
}
function SegmentBox(props: SegmentBoxProps) {
  const { first, material, condition, next, segmentId, canDropCondition, canDropMaterial, plan, onChange } = props;
  const css = useStyles();
  const perms = usePermission([
    PermissionType.edit_lesson_plan_content_238,
    PermissionType.edit_org_published_content_235,
    PermissionType.create_content_page_201,
    PermissionType.create_lesson_plan_221,
  ]);
  const editPlan = perms.edit_lesson_plan_content_238;
  const editAll = perms.edit_org_published_content_235;
  const createAll = perms.create_content_page_201;
  const createplan = perms.create_lesson_plan_221;
  const editable = editPlan || editAll || createAll || createplan;
  const addPlan = (data: DragData) => {
    const type = data.type === "condition" ? "condition" : "material";
    const newPlan = ModelLessonPlan.add(plan, segmentId, { [type]: data.item }, Boolean(first));
    if (plan !== newPlan) onChange(newPlan);
  };
  const setPlan = (data: DragData) => {
    const type = data.type === "condition" ? "condition" : "material";
    const newPlan = ModelLessonPlan.set(plan, segmentId, { [type]: data.item });
    if (plan !== newPlan) onChange(newPlan);
  };
  const handleRemove = useCallback(() => {
    const newPlan = ModelLessonPlan.remove(plan, segmentId);
    if (plan !== newPlan) onChange(newPlan);
  }, [plan, onChange, segmentId]);
  const { setNodeRef: materialDropRef } = useDroppable({ id: `${segmentId}_material`, data: { accept: ["LIBRARY_ITEM"], drop: setPlan } });
  const { setNodeRef: conditionDropRef } = useDroppable({ id: `${segmentId}_condition`, data: { accept: ["condition"], drop: setPlan } });
  const { setNodeRef: blankDropRef } = useDroppable({
    id: `${segmentId}_blank`,
    data: {
      accept: first ? ["LIBRARY_ITEM"] : ["LIBRARY_ITEM", "condition"],
      drop: addPlan,
    },
  });
  const computedCss = useSegmentComputedStyles({ ...props });
  const insertedNext = next && next.length > 0 ? next : material ? [{ segmentId: `virtual${segmentId}` }] : [];
  const segmentConditionId = `${segmentId}.condition`;
  const segmentMaterialId = `${segmentId}.material`;
  const hasNext = next && next.length > 0;
  const conditionRelations: Relation[] = [
    { sourceAnchor: "bottom", targetAnchor: "top", targetId: segmentMaterialId, style: { strokeWidth: 1 } },
  ];
  const materialRelations = next?.map(({ condition, segmentId }) => {
    const targetId = condition ? `${segmentId}.condition` : `${segmentId}.material`;
    return { sourceAnchor: "bottom", targetAnchor: "top", targetId } as Relation;
  });
  let segmentItemIdx = -1;
  // 既没选 material 也没选 condition 的情况
  if (!material && !condition)
    return editable ? (
      <div ref={blankDropRef} className={clsx(css.blankBox, css.drappableBox)}>
        <Typography align="center" variant="body1" color="textSecondary" style={{ width: 220 }}>
          {d("Drag and drop a lesson material here").t("library_msg_drag_lesson_material")}
        </Typography>
      </div>
    ) : (
      <div></div>
    );
  // 选 condition 但没选 material 的情况
  if (!material && condition)
    return (
      <Box className={computedCss.segment} display="flex" flexDirection="column" alignItems="center">
        <ArcherElement id={segmentConditionId} relations={conditionRelations}>
          <div className={clsx(css.arrowSourceCircle, { [css.drappableBox]: canDropCondition })}>
            <ConditionBtn ref={conditionDropRef} type={condition} />
          </div>
        </ArcherElement>
        <ArcherElement id={segmentMaterialId} relations={materialRelations}>
          <div className={clsx(computedCss.card, { [css.drappableBox]: !canDropCondition })}>
            <div ref={materialDropRef}>
              <Typography align="center" variant="body1" color="textSecondary" style={{ width: 220 }}>
                {d("Drag and drop a lesson material here").t("library_msg_drag_lesson_material")}
              </Typography>
            </div>
          </div>
        </ArcherElement>
      </Box>
    );
  const segmentNodes = (
    <Box className="segmentNext" display="flex" flexWrap="nowrap">
      {insertedNext.map((segmentItem) => (
        <SegmentBox plan={plan} onChange={onChange} key={++segmentItemIdx} {...{ ...segmentItem, canDropCondition, canDropMaterial }} />
      ))}
    </Box>
  );
  // 选 material 但没选 condition 的情况
  if (!condition)
    return (
      <Box className={computedCss.segment} display="flex" flexDirection="column" alignItems="center">
        <ArcherElement id={segmentMaterialId} relations={materialRelations}>
          <div className={clsx(computedCss.card, { [css.drappableBox]: canDropMaterial, [css.arrowSourceCircle]: hasNext })}>
            <MaterialCard onRemove={handleRemove} material={material || {}} ref={materialDropRef} />
          </div>
        </ArcherElement>
        {segmentNodes}
      </Box>
    );
  // 即选了 material 又选了 condition 的情况
  return (
    <Box className={computedCss.segment} display="flex" flexDirection="column" alignItems="center">
      <ArcherElement id={segmentConditionId} relations={conditionRelations}>
        <div className={clsx(css.arrowSourceCircle, { [css.drappableBox]: canDropCondition })}>
          <ConditionBtn ref={conditionDropRef} type={condition} />
        </div>
      </ArcherElement>
      <ArcherElement id={segmentMaterialId} relations={materialRelations}>
        <div className={clsx(computedCss.card, { [css.drappableBox]: canDropMaterial, [css.arrowSourceCircle]: hasNext })}>
          <MaterialCard onRemove={handleRemove} material={material || {}} ref={materialDropRef} />
        </div>
      </ArcherElement>
      {segmentNodes}
    </Box>
  );
}

const doNothing = (arg: any): any => {};

interface PlanComposeGraphicProps {
  value?: Segment;
  onChange?: (value: Segment) => any;
  nodeRef?: Ref<unknown>;
}
export const PlanComposeGraphic = forwardRef<HTMLDivElement, PlanComposeGraphicProps>((props, forwardedref) => {
  const { nodeRef: ref } = props;
  const onChange = props.onChange ?? doNothing;
  const value = JSON.stringify(props.value ?? {});
  const plan = useMemo(() => ModelLessonPlan.toSegment(value), [value]);
  const { palette } = useTheme<Theme>();
  const css = useStyles();
  const computedCss = useGraphicComputedStyles(plan);
  const { active } = useDndContext();
  const canDropCondition = Boolean(active?.data.current?.type === "LIBRARY_ITEM");
  const canDropMaterial = Boolean(active?.data.current?.type === "condition");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const archerRepaintKey = useMemo(() => Date.now(), [canDropCondition, canDropMaterial, plan]);
  const startRelations: Relation[] = [{ sourceAnchor: "bottom", targetAnchor: "top", targetId: "startTarget", style: { strokeWidth: 1 } }];
  return (
    <div ref={forwardedref}>
      <Box className={css.planComposeGraphic} {...{ ref }}>
        {false && (
          <Box position="relative" display="flex" alignItems="center" px={3} boxShadow={3}>
            <ButtonGroup className={css.headerButtonGroup}>
              <Button
                component={NavLink}
                activeClassName="active"
                variant="contained"
                className={css.headerButton}
                to="/library/content-edit/lesson/plan/tab/media/rightside/planComposeText"
              >
                <Typography variant="h6">A</Typography>
              </Button>
              <Button
                component={NavLink}
                activeClassName="active"
                variant="contained"
                className={css.headerButton}
                to="/library/content-edit/lesson/plan/tab/media/rightside/planComposeGraphic"
              >
                <DashboardOutlined />
              </Button>
            </ButtonGroup>
            <Typography className={css.headerTitle}>Condition Library</Typography>
            <Box display="flex" flexWrap="wrap" pb={3.5}>
              <DraggableConditionBtn className={css.headerConditionBtn} type="ifCorrect" />
              <DraggableConditionBtn className={css.headerConditionBtn} type="ifWrong" />
              <DraggableConditionBtn className={css.headerConditionBtn} type="ifScoreDown60" />
              <DraggableConditionBtn className={css.headerConditionBtn} type="ifScoreUp60" />
            </Box>
          </Box>
        )}
        <Box className={computedCss.composeArea}>
          <div className={css.bgImage} />
          <ArcherContainer
            svgContainerStyle={{ zIndex: -1 }}
            strokeColor={palette.grey[700]}
            strokeWidth={1}
            endShape={{ arrow: { arrowThickness: 9, arrowLength: 9 } }}
            noCurves
            key={archerRepaintKey}
          >
            <Box className="Box1" display="flex" flexDirection="column" alignItems="center">
              <ArcherElement id="start" relations={startRelations}>
                <div>
                  <ConditionBtn className={css.arrowSourceCircle} type="start" />
                </div>
              </ArcherElement>
              <Box className="box2" position="relative">
                <ArcherElement id="startTarget">
                  <Box className="box3" position="absolute" mt={5} width={0} />
                </ArcherElement>
              </Box>
              <SegmentBox {...{ ...plan, canDropMaterial, canDropCondition }} first plan={plan} onChange={onChange} />
            </Box>
          </ArcherContainer>
        </Box>
      </Box>
    </div>
  );
});
