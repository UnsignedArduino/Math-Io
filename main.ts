function on_buildable_tile (sprite: Sprite) {
    if (sprite.tileKindAt(TileDirection.Center, assets.tile`transparency8`)) {
        return true
    }
    return false
}
controller.B.onEvent(ControllerButtonEvent.Pressed, function () {
    timer.background(function () {
        if (!(blockMenu.isMenuOpen())) {
            enable_cursor(false)
            blockMenu.showMenu(["Cancel", "Delete", "Add"], MenuStyle.List, MenuLocation.BottomHalf)
            wait_for_select()
            if (blockMenu.selectedMenuIndex() == 1) {
                if (on_deleteable_tile(sprite_cursor_box)) {
                    tiles.setTileAt(tiles.locationOfSprite(sprite_cursor_box), assets.tile`transparency16`)
                } else {
                    game.showLongText("Cannot delete tile here!", DialogLayout.Bottom)
                }
            } else if (blockMenu.selectedMenuIndex() == 2) {
                if (on_buildable_tile(sprite_cursor_box)) {
                    blockMenu.showMenu(["Cancel", "Equipment", "Conveyor belt"], MenuStyle.List, MenuLocation.BottomHalf)
                    wait_for_select()
                    if (blockMenu.selectedMenuIndex() == 1) {
                    	
                    } else if (blockMenu.selectedMenuIndex() == 2) {
                        ask_for_conveyor()
                    }
                } else {
                    game.showLongText("Cannot place tile here!", DialogLayout.Bottom)
                }
            }
            enable_cursor(true)
        }
    })
})
function on_deleteable_tile (sprite: Sprite) {
    for (let tile of [
    assets.tile`conveyor_right`,
    assets.tile`conveyor_left`,
    assets.tile`conveyor_up`,
    assets.tile`conveyor_down`,
    assets.tile`conveyor_up_left`,
    assets.tile`conveyor_up_right`,
    assets.tile`conveyor_down_left`,
    assets.tile`conveyor_down_right`,
    assets.tile`conveyor_right_down`,
    assets.tile`conveyor_right_up`,
    assets.tile`conveyor_left_down`,
    assets.tile`conveyor_left_up`
    ]) {
        if (sprite.tileKindAt(TileDirection.Center, tile)) {
            return true
        }
    }
    return false
}
function make_cursor () {
    sprite_cursor = sprites.create(assets.image`cursor`, SpriteKind.Player)
    sprite_cursor_pointer = sprites.create(assets.image`cursor_pointer`, SpriteKind.Player)
    sprite_cursor_box = sprites.create(assets.image`cursor_box`, SpriteKind.Player)
    enable_cursor(true)
    tiles.placeOnRandomTile(sprite_cursor_pointer, assets.tile`acceptor`)
    scene.cameraFollowSprite(sprite_cursor_pointer)
    sprite_cursor_pointer.setFlag(SpriteFlag.GhostThroughWalls, true)
    sprite_cursor_pointer.setStayInScreen(true)
}
function ask_for_conveyor () {
    while (true) {
        blockMenu.showMenu([
        "Cancel",
        "Last placed conveyor belt",
        "^ Up ^",
        "v Down v",
        "< Left <",
        "> Right >"
        ], MenuStyle.Grid, MenuLocation.BottomHalf)
        wait_for_select()
        if (blockMenu.selectedMenuIndex() == 0) {
            break;
        } else if (blockMenu.selectedMenuIndex() == 1) {
            tiles.setTileAt(tiles.locationOfSprite(sprite_cursor_box), last_placed_belt)
            break;
        } else if (blockMenu.selectedMenuIndex() == 2) {
            blockMenu.showMenu(["Back", "^ Up straight ^", "^< Up left ^<", "^> Up right ^>"], MenuStyle.List, MenuLocation.BottomHalf)
            wait_for_select()
            if (blockMenu.selectedMenuIndex() == 1) {
                tiles.setTileAt(tiles.locationOfSprite(sprite_cursor_box), assets.tile`conveyor_up`)
                last_placed_belt = assets.tile`conveyor_up`
            } else if (blockMenu.selectedMenuIndex() == 2) {
                tiles.setTileAt(tiles.locationOfSprite(sprite_cursor_box), assets.tile`conveyor_up_left`)
                last_placed_belt = assets.tile`conveyor_up_left`
            } else if (blockMenu.selectedMenuIndex() == 3) {
                tiles.setTileAt(tiles.locationOfSprite(sprite_cursor_box), assets.tile`conveyor_up_right`)
                last_placed_belt = assets.tile`conveyor_up_right`
            }
            if (blockMenu.selectedMenuIndex() > 0) {
                break;
            }
        } else if (blockMenu.selectedMenuIndex() == 3) {
            blockMenu.showMenu(["Back", "v Down straight v", "v< Down left v<", "v> Down right v>"], MenuStyle.List, MenuLocation.BottomHalf)
            wait_for_select()
            if (blockMenu.selectedMenuIndex() == 1) {
                tiles.setTileAt(tiles.locationOfSprite(sprite_cursor_box), assets.tile`conveyor_down`)
                last_placed_belt = assets.tile`conveyor_down`
            } else if (blockMenu.selectedMenuIndex() == 2) {
                tiles.setTileAt(tiles.locationOfSprite(sprite_cursor_box), assets.tile`conveyor_down_left`)
                last_placed_belt = assets.tile`conveyor_down_left`
            } else if (blockMenu.selectedMenuIndex() == 3) {
                tiles.setTileAt(tiles.locationOfSprite(sprite_cursor_box), assets.tile`conveyor_down_right`)
                last_placed_belt = assets.tile`conveyor_down_right`
            }
            if (blockMenu.selectedMenuIndex() > 0) {
                break;
            }
        } else if (blockMenu.selectedMenuIndex() == 4) {
            blockMenu.showMenu(["Back", "< Straight left <", "<^ Left up <^", "<v Left down <v"], MenuStyle.List, MenuLocation.BottomHalf)
            wait_for_select()
            if (blockMenu.selectedMenuIndex() == 1) {
                tiles.setTileAt(tiles.locationOfSprite(sprite_cursor_box), assets.tile`conveyor_left`)
                last_placed_belt = assets.tile`conveyor_left`
            } else if (blockMenu.selectedMenuIndex() == 2) {
                tiles.setTileAt(tiles.locationOfSprite(sprite_cursor_box), assets.tile`conveyor_left_up`)
                last_placed_belt = assets.tile`conveyor_left_up`
            } else if (blockMenu.selectedMenuIndex() == 3) {
                tiles.setTileAt(tiles.locationOfSprite(sprite_cursor_box), assets.tile`conveyor_left_down`)
                last_placed_belt = assets.tile`conveyor_left_down`
            }
            if (blockMenu.selectedMenuIndex() > 0) {
                break;
            }
        } else if (blockMenu.selectedMenuIndex() == 5) {
            blockMenu.showMenu(["Back", "> Straight right >", ">^ Right up >^", ">v Right down >v"], MenuStyle.List, MenuLocation.BottomHalf)
            wait_for_select()
            if (blockMenu.selectedMenuIndex() == 1) {
                tiles.setTileAt(tiles.locationOfSprite(sprite_cursor_box), assets.tile`conveyor_right`)
                last_placed_belt = assets.tile`conveyor_right`
            } else if (blockMenu.selectedMenuIndex() == 2) {
                tiles.setTileAt(tiles.locationOfSprite(sprite_cursor_box), assets.tile`conveyor_right_up`)
                last_placed_belt = assets.tile`conveyor_right_up`
            } else if (blockMenu.selectedMenuIndex() == 3) {
                tiles.setTileAt(tiles.locationOfSprite(sprite_cursor_box), assets.tile`conveyor_right_down`)
                last_placed_belt = assets.tile`conveyor_right_down`
            }
            if (blockMenu.selectedMenuIndex() > 0) {
                break;
            }
        }
    }
}
function enable_cursor (en: boolean) {
    if (en) {
        controller.moveSprite(sprite_cursor_pointer, 64, 64)
    } else {
        controller.moveSprite(sprite_cursor_pointer, 0, 0)
    }
}
function make_map () {
    tiles.setSmallTilemap(tilemap`map`)
    scene.setBackgroundColor(13)
}
function wait_for_select () {
    selected = false
    while (!(selected)) {
        pause(100)
    }
    blockMenu.closeMenu()
}
blockMenu.onMenuOptionSelected(function (option, index) {
    selected = true
})
let selected = false
let sprite_cursor_pointer: Sprite = null
let sprite_cursor: Sprite = null
let sprite_cursor_box: Sprite = null
let last_placed_belt: Image = null
make_map()
make_cursor()
blockMenu.setColors(1, 15)
last_placed_belt = assets.tile`conveyor_up`
game.onUpdate(function () {
    sprite_cursor.top = sprite_cursor_pointer.top
    sprite_cursor.left = sprite_cursor_pointer.left
    sprite_cursor_box.y = sprite_cursor_pointer.top
    sprite_cursor_box.x = sprite_cursor_pointer.left
    tiles.placeOnTile(sprite_cursor_box, tiles.locationOfSprite(sprite_cursor_box))
})
